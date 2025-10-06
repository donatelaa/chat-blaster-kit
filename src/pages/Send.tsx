import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Send as SendIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, Profile } from "@/lib/api";

const Send = () => {
  const [selectedProfile, setSelectedProfile] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isSending, setIsSending] = useState(false);
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

  const handleSendMessage = async () => {
    if (!selectedProfile || !phoneNumber || !message) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const result = await api.sendMessage(selectedProfile, phoneNumber, message);
      
      if (result.success) {
        toast({
          title: "Сообщение отправлено!",
          description: `Сообщение отправлено на номер ${phoneNumber}`,
        });
        setPhoneNumber("");
        setMessage("");
      } else {
        toast({
          title: "Ошибка отправки",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка подключения",
        description: "Не удалось отправить сообщение. Проверьте подключение к серверу.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SendIcon className="h-5 w-5 text-primary" />
          Выберите профиль
        </CardTitle>
        <CardDescription>Выберите профиль для отправки сообщений</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Профиль</Label>
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите профиль" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.name} value={profile.name}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProfile && (
          <>
            <div className="space-y-2">
              <Label>Номер телефона</Label>
              <Input
                type="tel"
                placeholder="+7 999 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground">
                Введите номер в международном формате
              </p>
            </div>

            <div className="space-y-2">
              <Label>Сообщение</Label>
              <Textarea
                placeholder="Введите ваше сообщение..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] bg-secondary border-border resize-none"
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSendMessage}
              disabled={!phoneNumber || !message || isSending}
            >
              <SendIcon className="mr-2 h-4 w-4" />
              {isSending ? "Отправка..." : "Отправить сообщение"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Send;
