import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings } from "lucide-react";
import { api, Profile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Profiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await api.getProfiles();
      setProfiles(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить профили. Проверьте подключение к серверу.",
        variant: "destructive",
      });
    }
  };

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
                    Отправлено сообщений: {profile.messages_sent}
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
