import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Users, UserPlus, MessageSquare, BarChart3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname === "/") return "send";
    if (location.pathname === "/profiles") return "profiles";
    if (location.pathname === "/create-profile") return "create";
    if (location.pathname === "/mass-send") return "mass";
    if (location.pathname === "/analytics") return "analytics";
    return "send";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            WhatsApp Sender
          </h1>
          <p className="text-muted-foreground">
            Современная панель для управления рассылкой сообщений
          </p>
        </div>

        <Tabs value={getActiveTab()} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 bg-card border border-border">
            <TabsTrigger
              value="send"
              onClick={() => navigate("/")}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Send className="mr-2 h-4 w-4" />
              Отправить
            </TabsTrigger>
            <TabsTrigger
              value="profiles"
              onClick={() => navigate("/profiles")}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="mr-2 h-4 w-4" />
              Профили
            </TabsTrigger>
            <TabsTrigger
              value="create"
              onClick={() => navigate("/create-profile")}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Создать
            </TabsTrigger>
            <TabsTrigger
              value="mass"
              onClick={() => navigate("/mass-send")}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Массовая рассылка
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              onClick={() => navigate("/analytics")}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Аналитика
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {children}

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          © 2025 WhatsApp Sender. Все права защищены.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
