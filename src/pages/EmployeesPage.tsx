import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBasicInfo } from "../services/basicInfoApi";
import { fetchDetails } from "../services/detailsApi";
import { mergeByEmail, type MergedEmployee } from "../utils/mergeEmployees";
import s from "./EmployeesPage.module.css";

const PAGE_LIMIT = 5;

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState<MergedEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [basic, detail] = await Promise.all([
          fetchBasicInfo({ _page: page, _limit: PAGE_LIMIT }),
          fetchDetails({ _page: page, _limit: PAGE_LIMIT }),
        ]);
        if (!cancelled) {
          const merged = mergeByEmail(basic, detail);
          setEmployees(merged);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        if (!cancelled) setError("Failed to load employees");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const handleAddEmployee = () => {
    navigate("/wizard?role=admin");
  };

  return (
    <main className={s["c-employees"]}>
      <header className={s["c-employees__header"]}>
        <h1 className={s["c-employees__title"]}>Employees</h1>
        <button className={s["c-employees__add"]} onClick={handleAddEmployee}>
          + Add Employee
        </button>
      </header>

      {loading && <div className={s["c-employees__loading"]}>Loading…</div>}
      {error && <div className={s["c-employees__error"]}>{error}</div>}

      {!loading && !error && employees.length === 0 && (
        <div className={s["c-employees__empty"]}>No employees yet</div>
      )}

      {!loading && !error && employees.length > 0 && (
        <div className={s["c-employees__tableWrap"]}>
          <table className={s["c-employees__table"]}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Location</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.department || "\u2014"}</td>
                  <td>{emp.role || "\u2014"}</td>
                  <td>{emp.location || "\u2014"}</td>
                  <td>
                    {emp.photoBase64 ? (
                      <img
                        src={emp.photoBase64}
                        alt={emp.name}
                        className={s["c-employees__photo"]}
                      />
                    ) : (
                      <span className={s["c-employees__noPhoto"]}>N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className={s["c-employees__pagination"]}>
        <button
          className={s["c-employees__pageBtn"]}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}>
          Previous
        </button>
        <span className={s["c-employees__pageInfo"]}>Page {page}</span>
        <button
          className={s["c-employees__pageBtn"]}
          onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </footer>
    </main>
  );
};

export default EmployeesPage;
