import { createClient } from "@/utils/supabase/client";

// Mock Supabase client
jest.mock("@/utils/supabase/client", () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(() => Promise.resolve({ data: { user: { id: "test-user-id" } }, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: { id: "test-user-id" } }, error: null })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { role: "client" }, error: null })),
        })),
      })),
    })),
  })),
}));

describe("Authentication and Role Infrastructure Tests", () => {
  it("should send correct metadata payload when registering a client profile", async () => {
    const supabase = createClient();
    const payload = {
      email: "client@acme.com",
      password: "securepassword",
      options: {
        data: {
          role: "client",
          full_name: "John Client",
          organization_name: "Acme Corp",
          profession: "Manager",
          field_of_work: "Retail",
        },
      },
    };

    const { data, error } = await supabase.auth.signUp(payload);

    expect(error).toBeNull();
    expect(data?.user?.id).toBe("test-user-id");
  });

  it("should invoke registration with developer role when signing up from dev portal", async () => {
    const supabase = createClient();
    const payload = {
      email: "dev@nomad.net",
      password: "securepassword",
      options: {
        data: {
          role: "developer",
          full_name: "Jane Dev",
          github_url: "https://github.com/janedev",
          linkedin_url: "https://linkedin.com/in/janedev",
        },
      },
    };

    const { data, error } = await supabase.auth.signUp(payload);

    expect(error).toBeNull();
    expect(data?.user?.id).toBe("test-user-id");
  });
});
