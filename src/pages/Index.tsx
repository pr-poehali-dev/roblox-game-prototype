import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type CharacterClass = 'warrior' | 'mage' | 'archer' | null;

interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  maxLevel: number;
  description: string;
  cost: number;
}

interface Character {
  class: CharacterClass;
  level: number;
  exp: number;
  maxExp: number;
  skillPoints: number;
  stats: {
    health: number;
    mana: number;
    attack: number;
    defense: number;
  };
  skills: Skill[];
}

interface GuildMember {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  role: 'leader' | 'officer' | 'member';
  contribution: number;
  online: boolean;
}

interface Guild {
  id: string;
  name: string;
  tag: string;
  level: number;
  exp: number;
  maxExp: number;
  members: GuildMember[];
  maxMembers: number;
  description: string;
}

interface GuildQuest {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  requiredMembers: number;
  reward: {
    exp: number;
    gold: number;
  };
  progress: number;
  maxProgress: number;
}

const Index = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'selection' | 'game'>('selection');
  const [character, setCharacter] = useState<Character | null>(null);
  const [guild, setGuild] = useState<Guild | null>(null);
  const [guildName, setGuildName] = useState('');
  const [guildTag, setGuildTag] = useState('');
  const [createGuildOpen, setCreateGuildOpen] = useState(false);
  const [invitePlayerName, setInvitePlayerName] = useState('');

  const classes = [
    {
      id: 'warrior',
      name: 'Воин',
      icon: 'Sword',
      description: 'Мощный ближний боец с высокой защитой',
      stats: { health: 150, mana: 50, attack: 15, defense: 20 },
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'mage',
      name: 'Маг',
      icon: 'Sparkles',
      description: 'Владеет разрушительной магией стихий',
      stats: { health: 80, mana: 200, attack: 25, defense: 8 },
      color: 'from-purple-500 to-blue-500'
    },
    {
      id: 'archer',
      name: 'Лучник',
      icon: 'Target',
      description: 'Быстрый и меткий охотник',
      stats: { health: 100, mana: 100, attack: 20, defense: 12 },
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const selectClass = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (!selectedClass) return;

    const initialSkills: Skill[] = [
      {
        id: '1',
        name: classId === 'warrior' ? 'Удар щитом' : classId === 'mage' ? 'Огненный шар' : 'Точный выстрел',
        icon: classId === 'warrior' ? 'Shield' : classId === 'mage' ? 'Flame' : 'Crosshair',
        level: 0,
        maxLevel: 5,
        description: 'Базовая атака класса',
        cost: 1
      },
      {
        id: '2',
        name: classId === 'warrior' ? 'Боевой клич' : classId === 'mage' ? 'Ледяная стрела' : 'Ловушка',
        icon: classId === 'warrior' ? 'Volume2' : classId === 'mage' ? 'Snowflake' : 'Tent',
        level: 0,
        maxLevel: 5,
        description: 'Дополнительная способность',
        cost: 1
      },
      {
        id: '3',
        name: classId === 'warrior' ? 'Берсерк' : classId === 'mage' ? 'Телепорт' : 'Мультивыстрел',
        icon: classId === 'warrior' ? 'Zap' : classId === 'mage' ? 'Wand2' : 'Gauge',
        level: 0,
        maxLevel: 3,
        description: 'Ультимативная способность',
        cost: 2
      }
    ];

    setCharacter({
      class: classId as CharacterClass,
      level: 1,
      exp: 0,
      maxExp: 100,
      skillPoints: 3,
      stats: selectedClass.stats,
      skills: initialSkills
    });

    setGameState('game');
    
    toast({
      title: `${selectedClass.name} выбран!`,
      description: 'Начинаем приключение...'
    });
  };

  const upgradeSkill = (skillId: string) => {
    if (!character) return;

    const skill = character.skills.find(s => s.id === skillId);
    if (!skill || skill.level >= skill.maxLevel || character.skillPoints < skill.cost) {
      toast({
        title: 'Невозможно улучшить',
        description: 'Недостаточно очков навыков или максимальный уровень',
        variant: 'destructive'
      });
      return;
    }

    setCharacter({
      ...character,
      skillPoints: character.skillPoints - skill.cost,
      skills: character.skills.map(s =>
        s.id === skillId ? { ...s, level: s.level + 1 } : s
      )
    });

    toast({
      title: 'Навык улучшен!',
      description: `${skill.name} теперь ${skill.level + 1} уровня`
    });
  };

  const gainExp = () => {
    if (!character) return;

    const newExp = character.exp + 35;
    const levelUp = newExp >= character.maxExp;

    if (levelUp) {
      setCharacter({
        ...character,
        level: character.level + 1,
        exp: newExp - character.maxExp,
        maxExp: character.maxExp + 50,
        skillPoints: character.skillPoints + 2,
        stats: {
          health: character.stats.health + 10,
          mana: character.stats.mana + 10,
          attack: character.stats.attack + 2,
          defense: character.stats.defense + 1
        }
      });

      toast({
        title: '🎉 Повышение уровня!',
        description: `Вы достигли ${character.level + 1} уровня! +2 очка навыков`
      });
    } else {
      setCharacter({
        ...character,
        exp: newExp
      });

      toast({
        title: '+35 опыта',
        description: `${character.maxExp - newExp} до следующего уровня`
      });
    }
  };

  const createGuild = () => {
    if (!guildName || !guildTag || !character) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    const selectedClass = classes.find(c => c.id === character.class);
    const newGuild: Guild = {
      id: '1',
      name: guildName,
      tag: guildTag,
      level: 1,
      exp: 0,
      maxExp: 1000,
      maxMembers: 20,
      description: 'Новая гильдия',
      members: [
        {
          id: '1',
          name: 'Вы',
          class: character.class,
          level: character.level,
          role: 'leader',
          contribution: 0,
          online: true
        }
      ]
    };

    setGuild(newGuild);
    setCreateGuildOpen(false);
    setGuildName('');
    setGuildTag('');

    toast({
      title: '🎉 Гильдия создана!',
      description: `Добро пожаловать в [${guildTag}] ${guildName}`
    });
  };

  const invitePlayer = () => {
    if (!invitePlayerName || !guild) return;

    const randomClass: CharacterClass = ['warrior', 'mage', 'archer'][Math.floor(Math.random() * 3)] as CharacterClass;
    const newMember: GuildMember = {
      id: String(guild.members.length + 1),
      name: invitePlayerName,
      class: randomClass,
      level: Math.floor(Math.random() * 10) + 1,
      role: 'member',
      contribution: 0,
      online: Math.random() > 0.5
    };

    setGuild({
      ...guild,
      members: [...guild.members, newMember]
    });

    setInvitePlayerName('');

    toast({
      title: 'Игрок приглашён',
      description: `${invitePlayerName} присоединился к гильдии`
    });
  };

  const completeGuildQuest = (questReward: { exp: number; gold: number }) => {
    if (!guild) return;

    const newExp = guild.exp + questReward.exp;
    const levelUp = newExp >= guild.maxExp;

    if (levelUp) {
      setGuild({
        ...guild,
        level: guild.level + 1,
        exp: newExp - guild.maxExp,
        maxExp: guild.maxExp + 500
      });

      toast({
        title: '🎉 Уровень гильдии повышен!',
        description: `Гильдия достигла ${guild.level + 1} уровня`
      });
    } else {
      setGuild({
        ...guild,
        exp: newExp
      });

      toast({
        title: 'Квест выполнен!',
        description: `+${questReward.exp} опыта гильдии, +${questReward.gold} золота`
      });
    }
  };

  const guildQuests: GuildQuest[] = [
    {
      id: '1',
      name: 'Зачистка подземелья',
      description: 'Победите 50 монстров в тёмном подземелье',
      difficulty: 'easy',
      requiredMembers: 2,
      reward: { exp: 200, gold: 500 },
      progress: 0,
      maxProgress: 50
    },
    {
      id: '2',
      name: 'Охота на дракона',
      description: 'Сразитесь с древним драконом в его логове',
      difficulty: 'hard',
      requiredMembers: 5,
      reward: { exp: 800, gold: 2000 },
      progress: 0,
      maxProgress: 1
    },
    {
      id: '3',
      name: 'Турнир чемпионов',
      description: 'Победите в PvP турнире против других гильдий',
      difficulty: 'legendary',
      requiredMembers: 10,
      reward: { exp: 2000, gold: 5000 },
      progress: 0,
      maxProgress: 10
    }
  ];

  if (gameState === 'selection') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12 animate-float">
            <h1 className="text-6xl font-bold mb-4 gold-text">Fantasy RPG</h1>
            <p className="text-xl text-muted-foreground">Выберите своего героя</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {classes.map((classInfo) => (
              <Card
                key={classInfo.id}
                className="group relative overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                onClick={() => selectClass(classInfo.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${classInfo.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-card rounded-full flex items-center justify-center magic-glow group-hover:animate-pulse-glow">
                    <Icon name={classInfo.icon} size={48} className="text-primary" />
                  </div>

                  <h2 className="text-3xl font-bold mb-3">{classInfo.name}</h2>
                  <p className="text-muted-foreground mb-6">{classInfo.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name="Heart" size={16} className="text-red-500" />
                        Здоровье
                      </span>
                      <span className="font-bold">{classInfo.stats.health}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name="Sparkles" size={16} className="text-blue-500" />
                        Мана
                      </span>
                      <span className="font-bold">{classInfo.stats.mana}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name="Sword" size={16} className="text-orange-500" />
                        Атака
                      </span>
                      <span className="font-bold">{classInfo.stats.attack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name="Shield" size={16} className="text-green-500" />
                        Защита
                      </span>
                      <span className="font-bold">{classInfo.stats.defense}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6 group-hover:magic-glow" size="lg">
                    Выбрать
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!character) return null;

  const selectedClass = classes.find(c => c.id === character.class);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center magic-glow border-2 border-primary">
                <Icon name={selectedClass?.icon || 'User'} size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{selectedClass?.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="text-lg">
                    Уровень {character.level}
                  </Badge>
                  <span className="text-gold font-bold flex items-center gap-1">
                    <Icon name="Star" size={16} />
                    {character.skillPoints} очков навыков
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={() => setGameState('selection')} variant="outline">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Сменить класс
            </Button>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Опыт</span>
              <span className="text-sm text-muted-foreground">
                {character.exp} / {character.maxExp}
              </span>
            </div>
            <Progress value={(character.exp / character.maxExp) * 100} className="h-3" />
          </Card>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="stats">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Характеристики
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Icon name="Zap" size={16} className="mr-2" />
              Навыки
            </TabsTrigger>
            <TabsTrigger value="guild">
              <Icon name="Users" size={16} className="mr-2" />
              Гильдия
            </TabsTrigger>
            <TabsTrigger value="training">
              <Icon name="Target" size={16} className="mr-2" />
              Тренировка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 border-2 border-red-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Heart" size={24} className="text-red-500" />
                    <span className="text-xl font-bold">Здоровье</span>
                  </div>
                  <span className="text-3xl font-bold text-red-500">{character.stats.health}</span>
                </div>
                <Progress value={100} className="h-2 [&>div]:bg-red-500" />
              </Card>

              <Card className="p-6 border-2 border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Sparkles" size={24} className="text-blue-500" />
                    <span className="text-xl font-bold">Мана</span>
                  </div>
                  <span className="text-3xl font-bold text-blue-500">{character.stats.mana}</span>
                </div>
                <Progress value={100} className="h-2 [&>div]:bg-blue-500" />
              </Card>

              <Card className="p-6 border-2 border-orange-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Sword" size={24} className="text-orange-500" />
                    <span className="text-xl font-bold">Атака</span>
                  </div>
                  <span className="text-3xl font-bold text-orange-500">{character.stats.attack}</span>
                </div>
                <Progress value={(character.stats.attack / 50) * 100} className="h-2 [&>div]:bg-orange-500" />
              </Card>

              <Card className="p-6 border-2 border-green-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Shield" size={24} className="text-green-500" />
                    <span className="text-xl font-bold">Защита</span>
                  </div>
                  <span className="text-3xl font-bold text-green-500">{character.stats.defense}</span>
                </div>
                <Progress value={(character.stats.defense / 50) * 100} className="h-2 [&>div]:bg-green-500" />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="grid gap-4">
              {character.skills.map((skill) => (
                <Card key={skill.id} className="p-6 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-16 h-16 bg-card rounded-lg flex items-center justify-center border-2 border-primary/50">
                        <Icon name={skill.icon} size={32} className="text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{skill.name}</h3>
                          <Badge variant="outline">
                            {skill.level} / {skill.maxLevel}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{skill.description}</p>
                        
                        <Progress value={(skill.level / skill.maxLevel) * 100} className="h-2" />
                      </div>
                    </div>

                    <Button
                      onClick={() => upgradeSkill(skill.id)}
                      disabled={skill.level >= skill.maxLevel || character.skillPoints < skill.cost}
                      className="ml-4"
                    >
                      <Icon name="ArrowUp" size={16} className="mr-2" />
                      Улучшить ({skill.cost})
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guild">
            {!guild ? (
              <Card className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-card rounded-full flex items-center justify-center magic-glow">
                    <Icon name="Users" size={48} className="text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">Создайте свою гильдию</h3>
                  <p className="text-muted-foreground mb-6">
                    Объединяйтесь с друзьями для совместного прохождения контента
                  </p>

                  <Dialog open={createGuildOpen} onOpenChange={setCreateGuildOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="magic-glow">
                        <Icon name="Plus" size={20} className="mr-2" />
                        Создать гильдию
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Создание гильдии</DialogTitle>
                        <DialogDescription>
                          Придумайте название и тег для вашей гильдии
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Название гильдии</label>
                          <Input
                            placeholder="Легенды Арены"
                            value={guildName}
                            onChange={(e) => setGuildName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Тег гильдии</label>
                          <Input
                            placeholder="LEG"
                            maxLength={4}
                            value={guildTag}
                            onChange={(e) => setGuildTag(e.target.value.toUpperCase())}
                          />
                        </div>
                        <Button onClick={createGuild} className="w-full">
                          Создать
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="p-6 border-2 border-primary/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold">
                        <span className="text-gold">[{guild.tag}]</span> {guild.name}
                      </h2>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary" className="text-base">
                          Уровень {guild.level}
                        </Badge>
                        <span className="text-muted-foreground">
                          {guild.members.length} / {guild.maxMembers} участников
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Опыт гильдии</span>
                      <span className="text-muted-foreground">
                        {guild.exp} / {guild.maxExp}
                      </span>
                    </div>
                    <Progress value={(guild.exp / guild.maxExp) * 100} className="h-3" />
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Icon name="Users" size={20} />
                        Участники
                      </h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Icon name="UserPlus" size={16} className="mr-2" />
                            Пригласить
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Пригласить игрока</DialogTitle>
                            <DialogDescription>
                              Введите имя игрока для приглашения в гильдию
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Input
                              placeholder="Имя игрока"
                              value={invitePlayerName}
                              onChange={(e) => setInvitePlayerName(e.target.value)}
                            />
                            <Button onClick={invitePlayer} className="w-full">
                              Отправить приглашение
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {guild.members.map((member) => {
                          const memberClass = classes.find(c => c.id === member.class);
                          return (
                            <div
                              key={member.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-card border hover:border-primary/50 transition-colors"
                            >
                              <Avatar className="border-2 border-primary/50">
                                <AvatarFallback className="bg-primary/20">
                                  <Icon name={memberClass?.icon || 'User'} size={20} />
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{member.name}</span>
                                  {member.online && (
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{memberClass?.name}</span>
                                  <span>•</span>
                                  <span>Ур. {member.level}</span>
                                </div>
                              </div>

                              <Badge variant={member.role === 'leader' ? 'default' : 'outline'}>
                                {member.role === 'leader' ? 'Лидер' : member.role === 'officer' ? 'Офицер' : 'Участник'}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Icon name="Scroll" size={20} />
                      Гильдийские квесты
                    </h3>

                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {guildQuests.map((quest) => {
                          const difficultyColors = {
                            easy: 'bg-green-500/20 text-green-500 border-green-500/30',
                            medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
                            hard: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
                            legendary: 'bg-purple-500/20 text-purple-500 border-purple-500/30'
                          };

                          const canStart = guild.members.filter(m => m.online).length >= quest.requiredMembers;

                          return (
                            <Card key={quest.id} className={`p-4 border-2 ${difficultyColors[quest.difficulty]}`}>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold">{quest.name}</h4>
                                    <Badge variant="outline" className="capitalize">
                                      {quest.difficulty === 'easy' ? 'Лёгкий' : 
                                       quest.difficulty === 'medium' ? 'Средний' :
                                       quest.difficulty === 'hard' ? 'Сложный' : 'Легендарный'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <Icon name="Users" size={14} />
                                  <span>Требуется: {quest.requiredMembers} игроков</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Icon name="Star" size={14} className="text-blue-500" />
                                    +{quest.reward.exp} опыта
                                  </span>
                                  <span className="flex items-center gap-1 text-gold">
                                    <Icon name="Coins" size={14} />
                                    +{quest.reward.gold} золота
                                  </span>
                                </div>

                                <Button
                                  onClick={() => completeGuildQuest(quest.reward)}
                                  disabled={!canStart}
                                  size="sm"
                                  className="w-full"
                                >
                                  <Icon name="Play" size={14} className="mr-2" />
                                  Начать квест
                                </Button>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="training">
            <Card className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-card rounded-full flex items-center justify-center magic-glow animate-pulse-glow">
                  <Icon name="Swords" size={48} className="text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Тренировочная Арена</h3>
                <p className="text-muted-foreground mb-6">
                  Тренируйтесь, чтобы получать опыт и повышать уровень
                </p>

                <div className="space-y-4">
                  <Button onClick={gainExp} size="lg" className="w-full magic-glow">
                    <Icon name="Zap" size={20} className="mr-2" />
                    Начать бой (+35 опыта)
                  </Button>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="p-3 bg-card rounded-lg border">
                      <div className="text-muted-foreground mb-1">Уровень</div>
                      <div className="text-2xl font-bold text-primary">{character.level}</div>
                    </div>
                    <div className="p-3 bg-card rounded-lg border">
                      <div className="text-muted-foreground mb-1">Опыт</div>
                      <div className="text-2xl font-bold text-blue-500">{character.exp}</div>
                    </div>
                    <div className="p-3 bg-card rounded-lg border">
                      <div className="text-muted-foreground mb-1">Очки</div>
                      <div className="text-2xl font-bold text-gold">{character.skillPoints}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;