import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Chrome,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Stepper } from "../components/ui/stepper";
import { useToast } from "../hooks/use-toast";
import { useUser } from "../context/UserContext";
import { SignupFormData } from "../types/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  useSignup,
  useGoogleSignup,
  useConstituencies,
  usePanchayatsByConstituency,
} from "../hooks/useApi";
import { apiService } from "../services/api";

const STEPS = ["Personal Information", "Location Details"];

interface GoogleAuthState {
  googleAuth: boolean;
  email: string;
  name: string;
}

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  const googleAuthData = location.state as GoogleAuthState | null;
  const isGoogleSignup = googleAuthData?.googleAuth || false;

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    phone: "",
    constituency: "",
    panchayat: "",
    ward: "",
  });

  // API hooks
  const signupMutation = useSignup();
  const googleSignupMutation = useGoogleSignup();
  const {
    data: constituenciesData,
    isLoading: constituenciesLoading,
    error: constituenciesError,
  } = useConstituencies();
  const {
    data: panchayatsData,
    isLoading: panchayatsLoading,
    error: panchayatsError,
  } = usePanchayatsByConstituency(formData.constituency);

  // Show notification when using mock data
  useEffect(() => {
    if (constituenciesData && constituenciesData.constituencies.length > 0) {
      const firstConstituency = constituenciesData.constituencies[0];
      if (firstConstituency.name === "Thiruvananthapuram") {
        toast({
          title: "Demo Mode",
          description:
            "Using mock data for demonstration. Connect to backend for real data.",
          variant: "default",
        });
      }
    }
  }, [constituenciesData, toast]);

  // Pre-fill form data for Google signup
  useEffect(() => {
    if (isGoogleSignup && googleAuthData) {
      setFormData((prev) => ({
        ...prev,
        email: googleAuthData.email,
        username: googleAuthData.name,
      }));
    }
  }, [isGoogleSignup, googleAuthData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset dependent fields when parent changes
      if (name === "constituency") {
        newData.panchayat = "";
        newData.ward = "";
      } else if (name === "panchayat") {
        newData.ward = "";
      }

      return newData;
    });
    if (error) setError("");
  };

  const validateStep1 = () => {
    if (!formData.username.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!isGoogleSignup && !formData.password) {
      setError("Password is required");
      return false;
    }
    if (!isGoogleSignup && formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.constituency) {
      setError("Please select your constituency");
      return false;
    }
    if (!formData.panchayat) {
      setError("Please select your panchayat");
      return false;
    }
    if (!formData.ward) {
      setError("Please select your ward");
      return false;
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError("");
  };

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "MLA":
        navigate("/analytics");
        break;
      case "Department":
        navigate("/");
        break;
      default:
        navigate("/issues");
        break;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateStep2()) return;

    try {
      // Get constituency and panchayat IDs from the selected values
      const selectedConstituency = constituenciesData?.constituencies?.find(
        (c) => c.name === formData.constituency,
      );
      const selectedPanchayat = panchayatsData?.data?.find(
        (p) => p.name === formData.panchayat,
      );

      const selectedWard = selectedPanchayat?.ward_list?.find(
        (w) => w.ward_name === formData.ward,
      );

      if (!selectedConstituency || !selectedPanchayat) {
        setError("Please select valid constituency and panchayat");
        return;
      }

      // Prepare signup data
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: formData.username,
        phone_number: formData.phone,
        constituency_id: selectedConstituency.id,
        panchayat_id: selectedPanchayat._id,
        ward_no: selectedWard?._id,
      };

      console.log(signupData);

      await signupMutation.mutateAsync(signupData);
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err instanceof Error ? err.message : "Signup failed. Please try again.",
      );
    }
  };

  const handleGoogleSignup = async () => {
    setError("");

    try {
      // Check if we have constituency and panchayat data for mock signup
      if (!constituenciesData?.constituencies?.length) {
        setError(
          "Please wait for constituency data to load before using Google signup",
        );
        return;
      }

      // Get the first available constituency and panchayat for mock data
      const firstConstituency = constituenciesData.constituencies[0];
      const panchayatsForConstituency =
        await apiService.getPanchayatsByConstituencyName(
          firstConstituency.name,
        );
      const firstPanchayat = panchayatsForConstituency.data[0];

      if (!firstPanchayat) {
        setError(
          "No panchayats available for Google signup. Please use email signup instead.",
        );
        return;
      }

      // Simulate Google OAuth flow with realistic data
      const mockGoogleUser = {
        accessToken: "mock_google_access_token",
        email: formData.email || "newuser@gmail.com",
        name: formData.username || "New Google User",
        phone_number: formData.phone || "+91 9876543210",
        constituency_id: firstConstituency.id,
        panchayat_id: firstPanchayat.id,
        ward_no: firstPanchayat.ward_list[0]?.ward_name || "Ward 1",
      };

      await googleSignupMutation.mutateAsync(mockGoogleUser);
    } catch (err) {
      console.error("Google signup error:", err);
      setError(
        "Google authentication failed. Please try again or use email signup.",
      );
    }
  };

  const isLoading = signupMutation.isPending || googleSignupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">CitiZen</h1>
          </div>
          <p className="text-gray-600">Join the digital governance platform</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isGoogleSignup ? "Complete Your Profile" : "Create Your Account"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isGoogleSignup
                ? "Complete your registration with Google"
                : "Join CitiZen to connect with your community"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isGoogleSignup && (
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleSignup}
                disabled={isLoading || constituenciesLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <Chrome className="mr-2 h-4 w-4" />
                    Sign up with Google
                  </>
                )}
              </Button>
            )}

            {!isGoogleSignup && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-medium">
                    Or sign up with email
                  </span>
                </div>
              </div>
            )}

            <Stepper steps={STEPS} currentStep={currentStep} />

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {(constituenciesError || panchayatsError) && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {constituenciesError && (
                    <div>
                      <strong>Constituencies Error:</strong>{" "}
                      {constituenciesError.message}
                      <br />
                      <span className="text-sm">
                        Using demo data for testing.
                      </span>
                    </div>
                  )}
                  {panchayatsError && (
                    <div>
                      <strong>Panchayats Error:</strong>{" "}
                      {panchayatsError.message}
                      <br />
                      <span className="text-sm">
                        Using demo data for testing.
                      </span>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {currentStep === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                        disabled={isLoading || isGoogleSignup}
                      />
                    </div>
                  </div>
                </div>

                {!isGoogleSignup && (
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Constituency
                    </label>
                    <Select
                      value={formData.constituency}
                      onValueChange={(value) =>
                        handleSelectChange("constituency", value)
                      }
                      disabled={isLoading || constituenciesLoading}
                    >
                      <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue
                          placeholder={
                            constituenciesLoading
                              ? "Loading constituencies..."
                              : "Select your constituency"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {constituenciesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading constituencies...
                          </SelectItem>
                        ) : constituenciesData?.constituencies?.length === 0 ? (
                          <SelectItem value="no-data" disabled>
                            No constituencies available
                          </SelectItem>
                        ) : (
                          constituenciesData?.constituencies?.map(
                            (constituency) => (
                              <SelectItem
                                key={constituency.id}
                                value={constituency.name}
                              >
                                {constituency.name}
                              </SelectItem>
                            ),
                          ) || []
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Panchayat/Municipality
                    </label>
                    <Select
                      value={formData.panchayat}
                      onValueChange={(value) =>
                        handleSelectChange("panchayat", value)
                      }
                      disabled={
                        isLoading || !formData.constituency || panchayatsLoading
                      }
                    >
                      <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue
                          placeholder={
                            !formData.constituency
                              ? "Select constituency first"
                              : panchayatsLoading
                                ? "Loading panchayats..."
                                : "Select your panchayat/municipality"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {!formData.constituency ? (
                          <SelectItem value="select-first" disabled>
                            Please select a constituency first
                          </SelectItem>
                        ) : panchayatsLoading ? (
                          <SelectItem value="loading-panchayats" disabled>
                            Loading panchayats...
                          </SelectItem>
                        ) : panchayatsData?.data?.length === 0 ? (
                          <SelectItem value="no-panchayats" disabled>
                            No panchayats available for this constituency
                          </SelectItem>
                        ) : (
                          panchayatsData?.data?.map((panchayat) => (
                            <SelectItem
                              key={panchayat._id}
                              value={panchayat.name}
                            >
                              {panchayat.name}
                            </SelectItem>
                          )) || []
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ward
                    </label>
                    <Select
                      value={formData.ward}
                      onValueChange={(value) =>
                        handleSelectChange("ward", value)
                      }
                      disabled={isLoading || !formData.panchayat}
                    >
                      <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue
                          placeholder={
                            !formData.panchayat
                              ? "Select panchayat first"
                              : "Select your ward"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {!formData.panchayat ? (
                          <SelectItem value="select-panchayat-first" disabled>
                            Please select a panchayat first
                          </SelectItem>
                        ) : (
                          (() => {
                            const selectedPanchayat =
                              panchayatsData?.data?.find(
                                (p) => p.name === formData.panchayat,
                              );
                            const ward_list =
                              selectedPanchayat?.ward_list || [];

                            if (ward_list.length === 0) {
                              return (
                                <SelectItem value="no-ward_list" disabled>
                                  No ward_list available for this panchayat
                                </SelectItem>
                              );
                            }

                            return ward_list.map((ward) => (
                              <SelectItem key={ward._id} value={ward.ward_name}>
                                {ward.ward_name}
                              </SelectItem>
                            ));
                          })()
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isLoading}
                    className="flex-1 h-11 border-gray-300 hover:bg-gray-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Create Account
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
