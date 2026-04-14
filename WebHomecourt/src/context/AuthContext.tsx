import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Define el tipo de datos que contiene el contexto de autenticación
interface AuthContextType {
  session: Session | null; // Sesión actualizada del usuario autenticado
  user: User | null; // Información del usuario autenticado
  userType: number | null; // Tipo de usuario (0 = normal, 1 = admin)
  signIn: (email: string, password: string) => Promise<{ error: any } | undefined>; // Función para iniciar sesión
  signOut: () => Promise<void>; // Función para cerrar sesión
}

// contexto de autenticacion
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el componente que requiere sesion activa
type RequireSessionProps = {
  children: ReactNode; // Mostrar si hay sesion activa
  fallback?: ReactNode; // No sesion activa
}

// Proveedor principal de autenticacion
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<number | null>(null)

  // Obtiene sesion actual y escucha cambios de autenticacion
  useEffect(() => {
    // Sesion actual de Supabase
    supabase.auth.getSession().then(async ({ data }) => {
    setSession(data.session)
    setUser(data.session?.user ?? null)
    
    if (data.session?.user) {
      const { data: userData } = await supabase
        .from('user_laker')
        .select('user_type')
        .eq('user_id', data.session.user.id)
        .single()
      setUserType(userData?.user_type ?? null)
    }
  });

  const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // NUEVO: actualiza user_type en cada cambio de auth
      if (session?.user) {
        const { data: userData } = await supabase
          .from("user_laker")
          .select("user_type")
          .eq("user_id", session.user.id)
          .single();
        setUserType(userData?.user_type ?? null);
      } else {
        setUserType(null); // NUEVO: limpia al cerrar sesión
      }
    });

    
    // Desuscribete para evitar memory leaks
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Iniciar sesion con correo y contraseña
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  // Cerrar sesion
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, userType, signIn, signOut }}> 
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto de auth desde cualquier componente
// Lanza error si se usa fuera del AuthContextProvider
export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("UserAuth must be used within an AuthContextProvider");
  return context;
};

export const useAuth = UserAuth;

// Hook que requiere una sesion activa obligatoriamente
// Lanza error si el usuario no esta autenticado
export const useRequiredSession = () => {
  const { session } = useAuth();

  if (!session) {
    throw new Error("This component requires an active session");
  }

  return session;
};

// Renderiza contenido condicionalmente según si hay sesió¿on activa
// Muestra fallback si no hay sesion, o children si la hay
export const RequireSession = ({ children, fallback = null }: RequireSessionProps) => {
  const { session } = useAuth();

  // Si no hay sesion activa, renderiza el fallback
  if (!session) {
    return <>{fallback}</>;
  }

  // Si hay sesion, renderiza el contenido principal
  return <>{children}</>;
};