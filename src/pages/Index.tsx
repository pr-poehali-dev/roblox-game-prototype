import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

const Index = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'selection' | 'game'>('selection');
  const [character, setCharacter] = useState<Character | null>(null);

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
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="stats">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Характеристики
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Icon name="Zap" size={16} className="mr-2" />
              Навыки
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
