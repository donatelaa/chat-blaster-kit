import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings } from "lucide-react";

const Profiles = () => {
  // Mock profiles data
  const profiles = [
    { name: "Admin", messages: 145, phone: "+7 999 123 4567" },
    { name: "Olinda", messages: 89, phone: "+7 999 765 4321" },
    { name: "Ivan", messages: 203, phone: "+7 999 555 1234" },
    { name: "Test", messages: 12, phone: "+7 999 888 9999" },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Управление профилями
        </CardTitle>
        <CardDescription>Здесь вы можете управлять вашими профилями WhatsApp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profiles.map((profile) => (
          <Card key={profile.name} className="border-border bg-secondary/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.phone}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Отправлено сообщений: {profile.messages}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Настроить
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default Profiles;
