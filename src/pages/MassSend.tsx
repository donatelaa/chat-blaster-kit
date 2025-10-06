import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MassSend = () => {
  const [numbers, setNumbers] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [profileMessages, setProfileMessages] = useState<{ [key: string]: string }>({});
  const [delay, setDelay] = useState([30]);
  const [randomDelay, setRandomDelay] = useState(false);
  const { toast } = useToast();

  // Mock profiles
  const profiles = ["Admin", "Olinda", "Ivan", "Test"];

  const handleProfileToggle = (profile: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(profile) ? prev.filter((p) => p !== profile) : [...prev, profile]
    );
  };

  const handleProfileMessageChange = (profile: string, message: string) => {
    setProfileMessages((prev) => ({ ...prev, [profile]: message }));
  };

  const handleStartMassSend = () => {
    if (selectedProfiles.length === 0) {
      toast({
        title: "Ошибка",
        description: "Выберите хотя бы один профиль",
        variant: "destructive",
      });
      return;
    }

    if (!numbers) {
      toast({
        title: "Ошибка",
        description: "Добавьте номера телефонов",
        variant: "destructive",
      });
      return;
    }

    const hasMessages = selectedProfiles.every((profile) => profileMessages[profile]);
    if (!hasMessages) {
      toast({
        title: "Ошибка",
        description: "Добавьте сообщения для всех выбранных профилей",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Массовая рассылка запущена!",
      description: `Рассылка началась с задержкой ${randomDelay ? "случайной" : delay[0] + " сек"}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Массовая рассылка
          </CardTitle>
          <CardDescription>Отправьте сообщения большому количеству получателей</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Список номеров телефонов</Label>
            <Textarea
              placeholder="Введите номера телефонов (по одному на строку)&#10;+79991234567&#10;+79997654321&#10;+79995551234"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              className="min-h-[120px] bg-secondary border-border font-mono text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {numbers.split("\n").filter((n) => n.trim()).length} номеров добавлено
            </p>
          </div>

          <div className="space-y-4">
            <Label>Настройка задержки</Label>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {randomDelay ? "Случайная задержка (20-60 сек)" : `Задержка: ${delay[0]} сек`}
              </span>
              <div className="flex items-center gap-2">
                <Label htmlFor="random-delay" className="text-sm cursor-pointer">
                  Случайная задержка
                </Label>
                <Switch
                  id="random-delay"
                  checked={randomDelay}
                  onCheckedChange={setRandomDelay}
                />
              </div>
            </div>
            {!randomDelay && (
              <div className="space-y-2">
                <Slider
                  value={delay}
                  onValueChange={setDelay}
                  min={5}
                  max={120}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 сек</span>
                  <span>120 сек</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Выберите профили и сообщения</CardTitle>
          <CardDescription>Выберите профили и укажите сообщение для каждого</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profiles.map((profile) => (
            <Card key={profile} className="border-border bg-secondary/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={profile}
                    checked={selectedProfiles.includes(profile)}
                    onCheckedChange={() => handleProfileToggle(profile)}
                  />
                  <Label
                    htmlFor={profile}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {profile}
                  </Label>
                </div>
                {selectedProfiles.includes(profile) && (
                  <Textarea
                    placeholder={`Сообщение для профиля ${profile}...`}
                    value={profileMessages[profile] || ""}
                    onChange={(e) => handleProfileMessageChange(profile, e.target.value)}
                    className="min-h-[80px] bg-background border-border resize-none"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Button
        className="w-full"
        size="lg"
        onClick={handleStartMassSend}
        disabled={selectedProfiles.length === 0}
      >
        <Send className="mr-2 h-4 w-4" />
        Запустить массовую рассылку
      </Button>
    </div>
  );
};

export default MassSend;
