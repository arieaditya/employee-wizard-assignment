import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBasicInfo } from "../services/basicInfoApi";
import { fetchDetails } from "../services/detailsApi";
import { mergeByEmail, type MergedEmployee } from "../utils/mergeEmployees";

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
    <main>
      <header>
        <h1>Employees</h1>
        <button onClick={handleAddEmployee}>+ Add Employee</button>
      </header>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && employees.length === 0 && (
        <div>No employees yet</div>
      )}

      {!loading && !error && employees.length > 0 && (
        <table>
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
                <td>{emp.department || "—"}</td>
                <td>{emp.role || "—"}</td>
                <td>{emp.location || "—"}</td>
                <td>
                  {emp.photoBase64 ? (
                    <img
                      src={emp.photoBase64}
                      alt={emp.name}
                      style={{ width: 40, height: 40, objectFit: "cover" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer style={{ marginTop: 16 }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: "0 8px" }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </footer>
    </main>
  );
};

export default EmployeesPage;
