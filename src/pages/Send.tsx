import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Send as SendIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Send = () => {
  const [selectedProfile, setSelectedProfile] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  // Mock profiles data
  const profiles = ["Admin", "Olinda", "Ivan", "Test"];

  const handleAddNumber = () => {
    toast({
      title: "Номер добавлен",
      description: `Номер ${phoneNumber} добавлен в список`,
    });
  };

  const handleSendMessage = () => {
    if (!selectedProfile || !phoneNumber || !message) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Сообщение отправлено!",
      description: `Сообщение отправлено на номер ${phoneNumber}`,
    });

    // Reset form
    setPhoneNumber("");
    setMessage("");
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
                <SelectItem key={profile} value={profile}>
                  {profile}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProfile && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                Номер телефона
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddNumber}
                  disabled={!phoneNumber}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
              </Label>
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
              disabled={!phoneNumber || !message}
            >
              <SendIcon className="mr-2 h-4 w-4" />
              Отправить сообщение
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Send;
