import { render, screen } from "@testing-library/react";
import KomentarRealtime from "@/app/mahasiswa/KomentarRealtime";

describe("KomentarRealtime", () => {
  it("render komponen komentar realtime", () => {
    render(<KomentarRealtime />);
    expect(screen.getByText(/Komentar\/Log Real-Time/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tulis komentar/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kirim/i })).toBeInTheDocument();
  });
});
