import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  setAccessToken: (accessToken) => set({ accessToken }),
  clearState: () => set({ accessToken: null, user: null, loading: false }),

  signUp: async (username, password, email, lastName, firstName) => {
    try {
      set({ loading: true });
      // gọi api
      await authService.signUp(username, password, email, lastName, firstName);
      toast.success("Đăng ký thành công. Bạn sẽ được chuyển đến trang đăng nhập.");
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Đăng ký không thành công.");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username: string, password: string) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);

      await get().fetchMe();
      
      toast.success("Chào mừng bạn đến với ChatApp.");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Đăng nhập không thành công.");
    }finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Bạn đã đăng xuất.");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Đăng xuất không thành công.");
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.error("Fetch me error:", error);
      set({ user: null, accessToken: null });
      toast.error("Lỗi sảy ra khi lấy thông tin người dùng. Hãy thử lại!");
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();
      setAccessToken(accessToken);
      if(!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      get().clearState();
    }finally {
      set({ loading: false });
    }
  }
}));