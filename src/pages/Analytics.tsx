import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";

const Analytics = () => {
  // Mock data
  const stats = {
    sent: 369,
    delivered: 351,
    failed: 18,
    successRate: 95.1,
    avgDelay: 42,
  };

  const recentMessages = [
    { phone: "+7 999 123 4567", profile: "Admin", status: "delivered", time: "2 минуты назад" },
    { phone: "+7 999 765 4321", profile: "Olinda", status: "delivered", time: "5 минут назад" },
    { phone: "+7 999 555 1234", profile: "Ivan", status: "failed", time: "8 минут назад" },
    { phone: "+7 999 888 9999", profile: "Test", status: "delivered", time: "12 минут назад" },
    { phone: "+7 999 111 2222", profile: "Admin", status: "delivered", time: "15 минут назад" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Аналитика рассылок
          </CardTitle>
          <CardDescription>Статистика ваших рассылок и эффективность доставки</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-secondary/30 border-primary/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.sent}</div>
                <div className="text-xs text-muted-foreground">Отправлено</div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-green-500/20">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.delivered}</div>
                <div className="text-xs text-muted-foreground">Доставлено</div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-red-500/20">
              <CardContent className="p-4 text-center">
                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.failed}</div>
                <div className="text-xs text-muted-foreground">Ошибки</div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-primary/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.successRate}%</div>
                <div className="text-xs text-muted-foreground mt-2">Успешность</div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-primary/20">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.avgDelay}с</div>
                <div className="text-xs text-muted-foreground">Средняя задержка</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Последние 5 сообщений</CardTitle>
          <CardDescription>История последних отправленных сообщений</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMessages.map((msg, index) => (
              <Card key={index} className="bg-secondary/30 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {msg.status === "delivered" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{msg.phone}</div>
                        <div className="text-sm text-muted-foreground">
                          Профиль: {msg.profile}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{msg.time}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
