import { useState, useMemo } from "react";
import employeeData from "./assets/data_karyawan.json";
import swal from "sweetalert";

export default function App() {
  const [region, setRegion] = useState("");
  const [cabang, setCabang] = useState("");
  const [cabangManual, setCabangManual] = useState("");
  const [employee, setEmployee] = useState("");
  const [employeeManual, setEmployeeManual] = useState("");
  const [merkHP, setMerkHP] = useState("");
  const [merkHPManual, setMerkHPManual] = useState("");
  const [versiAndroid, setVersiAndroid] = useState("");
  const [versiAndroidManual, setVersiAndroidManual] = useState("");
  const [imei, setImei] = useState("");
  const [tipeHP, setTipeHP] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    if (!region) return "Region wajib dipilih";
    if (!cabang) return "Cabang wajib dipilih";
    if (cabang === "OTHERS" && !cabangManual.trim())
      return "Nama cabang manual wajib diisi";

    if (!employee) return "NIK - Nama Karyawan wajib dipilih";
    if (employee === "OTHERS" && !employeeManual.trim())
      return "NIK - Nama Karyawan manual wajib diisi";

    if (!merkHP) return "Merk HP wajib dipilih";
    if (merkHP === "OTHERS" && !merkHPManual.trim())
      return "Merk HP manual wajib diisi";

    if (!versiAndroid) return "Versi Android wajib dipilih";
    if (versiAndroid === "OTHERS" && !versiAndroidManual.trim())
      return "Versi Android manual wajib diisi";

    if (!tipeHP.trim()) return "Tipe HP wajib diisi";

    if (!imei) return "Android ID wajib diisi";
    if (imei.length !== 16) return "Android ID harus 16 digit";

    return null; // ✅ valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      swal("Data belum lengkap", error, "warning");
      return;
    }

    setIsLoading(true);

    const payload = {
      region,
      cabang: cabang === "OTHERS" ? cabangManual : cabang,
      employee: employee === "OTHERS" ? employeeManual : employee,
      merkHP: merkHP === "OTHERS" ? merkHPManual : merkHP,
      versiAndroid: versiAndroid === "OTHERS" ? versiAndroidManual : versiAndroid,
      tipeHP,
      imei,
    };

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbwXNGFQFpmGRY1OpM-TNmyCAMpJGgSJhkFsBh3Zp2jmz3JmhY-23wHWSYjkud4N7Ojzow/exec", {
        method: "POST",
        body: JSON.stringify({
          action: "inputDatabase",
          payload,
        }),
      });

      const result = await res.json();

      if (result.success) {
        swal("Berhasil", "Data berhasil disimpan", "success");

        // reset
        setRegion("");
        setCabang("");
        setCabangManual("");
        setEmployee("");
        setEmployeeManual("");
        setMerkHP("");
        setMerkHPManual("");
        setVersiAndroid("");
        setVersiAndroidManual("");
        setTipeHP("");
        setImei("");
      } else {
        swal("Gagal menyimpan", result.message, "error");
      }
    } catch (error) {
      swal("Koneksi gagal", "Tidak dapat terhubung ke server", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FULLSCREEN LOADING */}
      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
          }}
        >
          <div className="text-center text-white">
            <div className="spinner-border mb-3" role="status" />
            <div className="fw-semibold">Menyimpan data...</div>
            <small>Mohon tunggu sebentar</small>
          </div>
        </div>
      )}

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">

            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">

                <h4 className="text-center fw-semibold mb-1">
                  Pendaftaran Android ID
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
                  {/* Merk HP */}
                  <div className="form-floating mb-4">
                    <select
                      className="form-select"
                      value={merkHP}
                      onChange={(e) => {
                        setMerkHP(e.target.value);
                        setMerkHPManual("");
                        setVersiAndroid("");
                        setVersiAndroidManual("");
                      }}
                    >
                      <option value="">Pilih</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Oppo">Oppo</option>
                      <option value="Vivo">Vivo</option>
                      <option value="Realme">Realme</option>
                      <option value="Infinix">Infinix</option>
                      <option value="Poco">Poco</option>
                      <option value="Tecno">Tecno</option>
                      <option value="Asus">Asus</option>
                      <option value="Nokia">Nokia</option>
                      <option value="Sony">Sony</option>
                      <option value="Google Pixel">Google Pixel</option>
                      <option value="Honor">Honor</option>
                      <option value="ZTE">ZTE</option>
                      <option value="Advan">Advan</option>
                      <option value="Lenovo">Lenovo</option>
                      <option value="Motorola">Motorola</option>
                      <option value="Evercoss">Evercoss</option>
                      <option value="Sharp">Sharp</option>
                      <option value="Itel">Itel</option>
                      <option value="Meizu">Meizu</option>
                      <option value="OnePlus">OnePlus</option>
                      <option value="Nothing">Nothing</option>
                      <option value="Black Shark">Black Shark</option>
                      <option value="Nubia">Nubia</option>
                      <option value="Lava">Lava</option>
                      <option value="Luna">Luna</option>
                      <option value="MITO">MITO</option>
                      <option value="ZYRTX">ZYRTX</option>
                      <option value="OTHERS">Lainnya</option>
                    </select>
                    <label>Merk HP</label>
                  </div>

                  {merkHP === "OTHERS" && (
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Merk HP"
                        value={merkHPManual}
                        onChange={(e) => setMerkHPManual(e.target.value)}
                      />
                      <label>Merk HP (Manual)</label>
                    </div>
                  )}

                  <hr className="my-4" />
                  {/* Versi Android */}
                  <div className="form-floating mb-4">
                    <select
                      className="form-select"
                      value={versiAndroid}
                      onChange={(e) => {
                        setVersiAndroid(e.target.value);
                        setVersiAndroidManual("");
                      }}
                    >
                      <option value="">Pilih</option>
                      <option value="Android 8">Android 8</option>
                      <option value="Android 9">Android 9</option>
                      <option value="Android 10">Android 10</option>
                      <option value="Android 11">Android 11</option>
                      <option value="Android 12">Android 12</option>
                      <option value="Android 13">Android 13</option>
                      <option value="Android 13">Android 13</option>
                      <option value="Android 14">Android 14</option>
                      <option value="Android 15">Android 15</option>
                      <option value="Android 16">Android 16</option>
                      <option value="OTHERS">Lainnya</option>
                    </select>
                    <label>Versi Android</label>
                  </div>

                  {versiAndroid === "OTHERS" && (
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Merk HP"
                        value={versiAndroidManual}
                        onChange={(e) => setVersiAndroidManual(e.target.value)}
                      />
                      <label>Merk HP (Manual)</label>
                    </div>
                  )}

                  <hr className="my-4" />

                  {/* Tipe HP */}
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="tipeHP"
                      value={tipeHP}
                      onChange={(e) => setTipeHP(e.target.value)}
                    />
                    <label>Tipe HP</label>
                  </div>


                  <hr className="my-4" />

                  {/* IMEI */}
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Android ID"
                      value={imei}
                      maxLength={16}
                      onChange={(e) => setImei(e.target.value)}
                    />
                    <label>Android ID (16 Digit)</label>
                  </div>

                  <div className="text-center mt-2">
                    <small className="text-muted d-block mt-1">
                      Contoh letak Android ID pada perangkat
                    </small>
                    <img
                      src="/imei-example.png"
                      alt="Contoh Letak Android ID"
                      className="img-fluid rounded border"
                      style={{ maxHeight: "500px" }}
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100 rounded-3"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Menyimpan..." : "Submit Data"}
                  </button>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
