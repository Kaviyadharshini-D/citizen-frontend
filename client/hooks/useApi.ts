import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import { useToast } from "./use-toast";
import { useUser } from "../context/UserContext";
import {
  IssueFilter,
  Issue,
  Constituency,
  Panchayat,
  IssueStatistics,
  LoginRequest,
  GoogleLoginRequest,
  SignupRequest,
  GoogleSignupRequest,
  ChangePasswordRequest,
  UpdateUserDetailsRequest,
  User as ApiUser,
  RoleTypes,
  MLADashboardData,
} from "../types/api";
import { UserRole } from "../types/auth";

// Helper function to map API User to UserContext User
const mapApiUserToContextUser = (apiUser: ApiUser) => {
  const roleMapping: Record<RoleTypes, UserRole> = {
    [RoleTypes.CITIZEN]: "citizen",
    [RoleTypes.MLASTAFF]: "mlastaff",
    [RoleTypes.DEPT]: "dept",
    [RoleTypes.DEPT_STAFF]: "dept_staff",
    [RoleTypes.ADMIN]: "admin",
  };

  const userRole = roleMapping[apiUser.role] || "citizen";

  // Set appropriate position based on role
  const getPositionFromRole = (role: string): string => {
    switch (role) {
      case "mlastaff":
        return "Member of Legislative Assembly";
      case "dept":
        return "Department Officer";
      case "dept_staff":
        return "Department Staff";
      case "admin":
        return "Administrator";
      case "citizen":
        return "Citizen";
      default:
        return "User";
    }
  };

  return {
    name: apiUser.name,
    role: userRole,
    position: getPositionFromRole(userRole),
    avatar: "", // API doesn't provide avatar, use empty string
  };
};

// Query Keys
export const queryKeys = {
  // Auth
  user: ["user"],

  // Issues
  issues: (filters?: IssueFilter) => ["issues", filters],
  issue: (id: string) => ["issue", id],
  issueStatistics: ["issueStatistics"],
  userIssues: (userId: string) => ["issues", "user", userId],
  constituencyIssues: (constituencyId: string) => [
    "issues",
    "constituency",
    constituencyId,
  ],

  // Location
  constituencies: ["constituencies"],
  constituency: (id: string) => ["constituency", id],
  panchayats: ["panchayats"],
  panchayat: (id: string) => ["panchayat", id],
  panchayatsByConstituency: (constituencyId: string) => [
    "panchayats",
    "constituency",
    constituencyId,
  ],
} as const;

// Auth Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: apiService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => apiService.loginWithEmail(data),
    onSuccess: (data) => {
      // Store token and user data
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      // Update user context with mapped user data
      const mappedUser = mapApiUserToContextUser(data.user);
      setUser(mappedUser as any); // Type assertion to fix compatibility

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      toast({
        title: "Welcome Back!",
        description: `Successfully signed in as ${data.user.name}`,
      });

      // Redirect based on user role
      redirectBasedOnRole(mappedUser.role);
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your credentials",
        variant: "destructive",
      });
    },
  });
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: GoogleLoginRequest) => apiService.loginWithGoogle(data),
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      const mappedUser = mapApiUserToContextUser(data.user);
      setUser(mappedUser as any); // Type assertion to fix compatibility

      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      toast({
        title: "Welcome Back!",
        description: "Successfully signed in with Google",
      });

      // Redirect based on user role
      redirectBasedOnRole(mappedUser.role);
    },
    onError: (error) => {
      toast({
        title: "Google Login Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SignupRequest) => apiService.signupWithEmail(data),
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      const user = mapApiUserToContextUser(data.user);
      setUser(user as any); // Type assertion to fix compatibility

      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      toast({
        title: "Account Created Successfully!",
        description: `Welcome to CitiZen, ${data.user.name}!`,
      });

      // Redirect based on user role
      redirectBasedOnRole(user.role);
    },
    onError: (error) => {
      toast({
        title: "Signup Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

export const useGoogleSignup = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: GoogleSignupRequest) =>
      apiService.signupWithGoogle(data),
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      const user = mapApiUserToContextUser(data.user);
      setUser(user as any); // Type assertion to fix compatibility

      queryClient.invalidateQueries({ queryKey: queryKeys.user });

      toast({
        title: "Account Created Successfully!",
        description: `Welcome to CitiZen, ${data.user.name}!`,
      });

      // Redirect based on user role
      redirectBasedOnRole(user.role);
    },
    onError: (error) => {
      toast({
        title: "Google Signup Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

export const useChangePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      apiService.changePassword(data),
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Password Change Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateUserDetails = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateUserDetailsRequest) =>
      apiService.updateUserDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

// Issues Hooks
export const useIssues = (filters?: IssueFilter) => {
  return useQuery({
    queryKey: queryKeys.issues(filters),
    queryFn: () => apiService.getIssues(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useIssue = (id: string) => {
  return useQuery({
    queryKey: queryKeys.issue(id),
    queryFn: () => apiService.getIssueById(id),
    enabled: !!id,
  });
};

export const useIssueStatistics = () => {
  return useQuery({
    queryKey: queryKeys.issueStatistics,
    queryFn: () => apiService.getIssueStatistics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserIssues = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.userIssues(userId),
    queryFn: () => apiService.getIssuesByUserId(userId),
    enabled: !!userId,
  });
};

export const useConstituencyIssues = (constituencyId: string) => {
  return useQuery({
    queryKey: queryKeys.constituencyIssues(constituencyId),
    queryFn: () => apiService.getIssuesByConstituency(constituencyId),
    enabled: !!constituencyId,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: FormData) => apiService.createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Issue Created",
        description: "Your issue has been submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Issue Creation Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Issue> }) =>
      apiService.updateIssue(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issue(id) });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Issue Updated",
        description: "Issue has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateIssueStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiService.updateIssueStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issue(id) });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Status Updated",
        description: "Issue status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Status Update Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Issue Deleted",
        description: "Issue has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });
};

export const useUpvoteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: string) => apiService.upvoteIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};

export const useRemoveUpvote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: string) => apiService.removeUpvote(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};

// Location Hooks
export const useConstituencies = () => {
  return useQuery({
    queryKey: queryKeys.constituencies,
    queryFn: () => apiService.getConstituencies(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

export const useConstituency = (id: string) => {
  return useQuery({
    queryKey: queryKeys.constituency(id),
    queryFn: () => apiService.getConstituencyById(id),
    enabled: !!id,
    retry: 2,
  });
};

export const usePanchayats = () => {
  return useQuery({
    queryKey: queryKeys.panchayats,
    queryFn: () => apiService.getPanchayats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

export const usePanchayat = (id: string) => {
  return useQuery({
    queryKey: queryKeys.panchayat(id),
    queryFn: () => apiService.getPanchayatById(id),
    enabled: !!id,
    retry: 2,
  });
};

export const usePanchayatsByConstituency = (constituencyName: string) => {
  return useQuery({
    queryKey: queryKeys.panchayatsByConstituency(constituencyName),
    queryFn: () => apiService.getPanchayatsByConstituencyName(constituencyName),
    enabled: !!constituencyName,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

// MLA Dashboard Hooks
export const useMLADashboard = (constituencyId: string) => {
  return useQuery({
    queryKey: ["mla-dashboard", constituencyId],
    queryFn: () => apiService.getMLADashboard(constituencyId),
    enabled: !!constituencyId,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMLADashboardStats = (constituencyId: string) => {
  return useQuery({
    queryKey: ["mla-dashboard-stats", constituencyId],
    queryFn: () => apiService.getMLADashboardStats(constituencyId),
    enabled: !!constituencyId,
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateMLADashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      constituencyId,
      data,
    }: {
      constituencyId: string;
      data: Partial<MLADashboardData>;
    }) => apiService.updateMLADashboard(constituencyId, data),
    onSuccess: (_, { constituencyId }) => {
      // Invalidate and refetch dashboard data
      queryClient.invalidateQueries({
        queryKey: ["mla-dashboard", constituencyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["mla-dashboard-stats", constituencyId],
      });
    },
  });
};

// Helper function to redirect based on user role
const redirectBasedOnRole = (role: string) => {
  // Use window.location for navigation since we're in a hook
  // This will trigger a full page reload but ensures proper routing
  // In a production app, you might want to use a more sophisticated approach
  setTimeout(() => {
    switch (role) {
      case "mlastaff":
        window.location.href = "/analytics";
        break;
      case "dept":
      case "dept_staff":
        window.location.href = "/";
        break;
      case "admin":
        window.location.href = "/"; // Admin has access to all pages
        break;
      case "citizen":
        window.location.href = "/issues";
        break;
      default:
        window.location.href = "/issues";
        break;
    }
  }, 100); // Small delay to ensure state updates are processed
};
