import { useState, useMemo } from "react";
import employeeData from "./assets/data_karyawan.json";

export default function App() {
  const [region, setRegion] = useState("");
  const [cabang, setCabang] = useState("");
  const [cabangManual, setCabangManual] = useState("");
  const [employee, setEmployee] = useState("");
  const [employeeManual, setEmployeeManual] = useState("");
  const [imei, setImei] = useState("");

  const regions = useMemo(
    () => [...new Set(employeeData.map(d => d.REGION_NAME))],
    []
  );

  const cabangs = useMemo(() => {
    if (!region) return [];
    return [
      ...new Set(
        employeeData
          .filter(d => d.REGION_NAME === region)
          .map(d => d.COMP_OFFICE_NAME)
      ),
    ];
  }, [region]);

  const employees = useMemo(() => {
    if (!region || !cabang || cabang === "OTHERS") return [];
    return employeeData.filter(
      d =>
        d.REGION_NAME === region &&
        d.COMP_OFFICE_NAME === cabang
    );
  }, [region, cabang]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      region,
      cabang: cabang === "OTHERS" ? cabangManual : cabang,
      employee:
        employee === "OTHERS" ? employeeManual : employee,
      imei,
    };

    console.log(payload);

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbyN5aWndxFmiCyk3NvNhFdikCWFRXv8wm33Rm7iURlrap0nNNG6KrIyutfzRIxhW3oipQ/exec", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json"
        // },
        body: JSON.stringify({
          action: "inputDatabase",
          payload: payload,
        }
        ),
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Data berhasil disimpan");

        // reset form
        setRegion("");
        setCabang("");
        setCabangManual("");
        setEmployee("");
        setEmployeeManual("");
        setImei("");
      } else {
        alert("❌ Gagal: " + result.message);
      }
    } catch (error) {
      alert("❌ Error koneksi");
      console.error(error);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">

          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">

              <h4 className="text-center fw-semibold mb-1">
                Pendaftaran IMEI
              </h4>
              <p className="text-center text-muted small mb-4">
                Lengkapi data berikut dengan benar
              </p>

              <form onSubmit={handleSubmit}>

                {/* REGION */}
                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCabang("");
                      setCabangManual("");
                      setEmployee("");
                      setEmployeeManual("");
                    }}
                  >
                    <option value="">Pilih</option>
                    {regions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <label>Region</label>
                </div>

                {/* CABANG */}
                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    value={cabang}
                    disabled={!region}
                    onChange={(e) => {
                      setCabang(e.target.value);
                      setCabangManual("");
                      setEmployee("");
                      setEmployeeManual("");
                    }}
                  >
                    <option value="">Pilih</option>
                    {cabangs.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="OTHERS">Lainnya</option>
                  </select>
                  <label>Cabang</label>
                </div>

                {cabang === "OTHERS" && (
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cabang manual"
                      value={cabangManual}
                      onChange={(e) => setCabangManual(e.target.value)}
                    />
                    <label>Nama Cabang (Manual)</label>
                  </div>
                )}

                <hr className="my-4" />

                {/* EMPLOYEE */}
                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    value={employee}
                    disabled={!cabang}
                    onChange={(e) => {
                      setEmployee(e.target.value);
                      setEmployeeManual("");
                    }}
                  >
                    <option value="">Pilih</option>
                    {employees.map(emp => {
                      const empValue = `${emp.EMPLOYEE_ID} - ${emp.NAME_KTP}`;
                      return (
                        <option
                          key={emp.EMPLOYEE_ID}
                          value={empValue}
                        >
                          {empValue}
                        </option>
                      );
                    })}
                    <option value="OTHERS">Lainnya</option>
                  </select>
                  <label>NIK - Nama Karyawan</label>
                </div>

                {employee === "OTHERS" && (
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="NIK - Nama"
                      value={employeeManual}
                      onChange={(e) => setEmployeeManual(e.target.value)}
                    />
                    <label>NIK - Nama (Manual)</label>
                  </div>
                )}

                <hr className="my-4" />

                {/* IMEI */}
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="IMEI"
                    value={imei}
                    inputMode="numeric"
                    maxLength={15}
                    onChange={(e) => {
                      // hanya angka & tetap string
                      const val = e.target.value.replace(/\D/g, "");
                      setImei(val);
                    }}
                  />
                  <label>IMEI (15 Digit)</label>
                </div>

                <div className="text-center mt-2">
                  <img
                    src="/imei-example.png"
                    alt="Contoh Letak IMEI"
                    className="img-fluid rounded border"
                    style={{ maxHeight: "500px" }}
                  />
                  <small className="text-muted d-block mt-1">
                    Contoh letak IMEI pada perangkat
                  </small>
                </div>

                <button className="btn btn-primary btn-lg w-100 rounded-3" type="submit">
                  Submit Data
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
