import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import { locationData } from "../data/locationData";

const initialForm = {
  username: "",
  email: "",
  password: "",
  phone: "",
  constituency: "",
  panchayat: "",
  ward: "",
  googleSignup: false,
};

export default function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

  // Dropdown options
  const panchayatOptions = locationData.find(c => c.constituency === form.constituency)?.panchayats || [];
  const wardOptions = panchayatOptions.find(p => p.name === form.panchayat)?.wards || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    navigate("/dashboard");
  };

  const handleGoogleSignup = () => {
    // Simulate Google SSO: prefill email and username
    setForm({
      ...form,
      email: "user@gmail.com",
      username: "Google User",
      googleSignup: true,
    });
    setStep(1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <Button type="button" variant="outline" className="w-full mb-4" onClick={handleGoogleSignup}>
          Sign up with Google
        </Button>
        <form onSubmit={step === 1 ? handleNext : handleSignup}>
          {step === 1 && (
            <>
              <Input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="mb-4"
                required
                disabled={form.googleSignup ? false : undefined}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="mb-4"
                required
                disabled={form.googleSignup ? true : undefined}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="mb-4"
                required
                disabled={form.googleSignup ? true : undefined}
              />
              <Input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="mb-4"
                required
              />
              <Button type="submit" className="w-full">Next</Button>
            </>
          )}
          {step === 2 && (
            <>
              <label className="block mb-2">Constituency</label>
              <select
                name="constituency"
                value={form.constituency}
                onChange={handleChange}
                className="mb-4 w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Constituency</option>
                {locationData.map(c => (
                  <option key={c.constituency} value={c.constituency}>{c.constituency}</option>
                ))}
              </select>
              <label className="block mb-2">Panchayat</label>
              <select
                name="panchayat"
                value={form.panchayat}
                onChange={handleChange}
                className="mb-4 w-full border rounded px-3 py-2"
                required
                disabled={!form.constituency}
              >
                <option value="">Select Panchayat</option>
                {panchayatOptions.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
              <label className="block mb-2">Ward</label>
              <select
                name="ward"
                value={form.ward}
                onChange={handleChange}
                className="mb-6 w-full border rounded px-3 py-2"
                required
                disabled={!form.panchayat}
              >
                <option value="">Select Ward</option>
                {wardOptions.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              <Button type="submit" className="w-full">Sign Up</Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}