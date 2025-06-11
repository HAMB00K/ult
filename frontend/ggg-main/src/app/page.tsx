"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, Mic, Brain, ShieldAlert, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  animationDelay?: string;
  shouldAnimate: boolean;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  animationDelay = "0s",
  shouldAnimate,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "shadow-lg rounded-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card/70 backdrop-blur-md border-border/50 hover:border-primary/70",
        shouldAnimate ? "animate-emerge-up" : "opacity-0 translate-y-[50px]",
      )}
      style={{ animationDelay: shouldAnimate ? animationDelay : undefined }}
    >
      <CardHeader className="items-center text-center pt-8 pb-4">
        <div className="p-3 bg-primary/20 rounded-full mb-4 border border-primary/50">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl font-semibold font-headline">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center px-6 pb-8">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  avatarFallback: string;
  imageHint: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Alice Dupont",
    role: "Lead Developer",
    imageUrl: "https://placehold.co/300x300.png",
    avatarFallback: "AD",
    imageHint: "portrait professional",
  },
  {
    name: "Bob Martin",
    role: "UI/UX Designer",
    imageUrl: "https://placehold.co/300x300.png",
    avatarFallback: "BM",
    imageHint: "portrait creative",
  },
  {
    name: "Charles Leclerc",
    role: "AI Specialist",
    imageUrl: "https://placehold.co/300x300.png",
    avatarFallback: "CL",
    imageHint: "portrait tech",
  },
  {
    name: "Diana Moreau",
    role: "Cybersecurity Analyst",
    imageUrl: "https://placehold.co/300x300.png",
    avatarFallback: "DM",
    imageHint: "portrait security",
  },
];

interface TeamMemberCardProps {
  member: TeamMember;
  animationDelay?: string;
  shouldAnimate: boolean;
}

function TeamMemberCard({
  member,
  animationDelay = "0s",
  shouldAnimate,
}: TeamMemberCardProps) {
  return (
    <Card
      className={cn(
        "shadow-lg rounded-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card/80 backdrop-blur-md border-border/50 hover:border-primary/70 text-center p-6",
        shouldAnimate ? "animate-emerge-up" : "opacity-0 translate-y-[50px]",
      )}
      style={{ animationDelay: shouldAnimate ? animationDelay : undefined }}
    >
      <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/30 shadow-md">
        <AvatarImage
          src={member.imageUrl}
          alt={member.name}
          data-ai-hint={member.imageHint}
        />
        <AvatarFallback className="text-3xl bg-primary/20 text-primary">
          {member.avatarFallback}
        </AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-headline font-semibold text-foreground">
        {member.name}
      </h3>
      <p className="text-primary">{member.role}</p>
    </Card>
  );
}

const DecorativeHoop = ({
  size,
  position,
  animationDuration,
  animationName = "animate-spin-slow",
}: {
  size: number;
  position: string;
  animationDuration: string;
  animationName?: string;
}) => {
  return (
    <div
      className={`absolute ${animationName} ${position} pointer-events-none opacity-30 md:opacity-50 z-0`}
      style={{ animationDuration }}
    >
      <div
        className="rounded-full border-4 border-primary/30 bg-gradient-to-r from-primary/20 via-transparent to-primary/10"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default function LandingPage() {
  const featuresData: Omit<
    FeatureCardProps,
    "animationDelay" | "shouldAnimate"
  >[] = [
    {
      icon: Mic,
      title: "Analyse Vocale",
      description:
        "Posez vos questions en utilisant votre voix pour une interaction plus rapide et naturelle.",
    },
    {
      icon: Brain,
      title: "Réponses Intelligentes",
      description:
        "Obtenez des explications claires et précises grâce à notre IA spécialisée en cybersécurité.",
    },
    {
      icon: ShieldAlert,
      title: "Infos Menaces Actuelles",
      description:
        "Restez informé des dernières vulnérabilités, attaques et tendances en matière de sécurité.",
    },
    {
      icon: UserCheck,
      title: "Conseils Personnalisés",
      description:
        "Recevez des recommandations de sécurité adaptées à vos besoins et à votre contexte.",
    },
  ];

  const heroContentRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [heroContentVisible, setHeroContentVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const createObserverCallback = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    return (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setter(entry.isIntersecting);
      });
    };
  };

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      createObserverCallback(setHeroContentVisible),
      { threshold: 0.1 },
    );
    const featuresObserver = new IntersectionObserver(
      createObserverCallback(setFeaturesVisible),
      { threshold: 0.1 },
    );
    const teamObserver = new IntersectionObserver(
      createObserverCallback(setTeamVisible),
      { threshold: 0.1 },
    );
    const footerObserver = new IntersectionObserver(
      createObserverCallback(setFooterVisible),
      { threshold: 0.1 },
    );

    if (heroContentRef.current) heroObserver.observe(heroContentRef.current);
    if (featuresSectionRef.current)
      featuresObserver.observe(featuresSectionRef.current);
    if (teamSectionRef.current) teamObserver.observe(teamSectionRef.current);
    if (footerRef.current) footerObserver.observe(footerRef.current);

    return () => {
      if (heroContentRef.current)
        heroObserver.unobserve(heroContentRef.current);
      if (featuresSectionRef.current)
        featuresObserver.unobserve(featuresSectionRef.current);
      if (teamSectionRef.current)
        teamObserver.unobserve(teamSectionRef.current);
      if (footerRef.current) footerObserver.unobserve(footerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-center min-h-screen p-8 lg:p-16 overflow-hidden">
        <div
          ref={heroContentRef}
          className={cn(
            "lg:w-3/5 xl:w-1/2 space-y-8 z-10 text-center lg:text-left",
            heroContentVisible ? "animate-emerge-up" : "opacity-0",
          )}
        >
          <div className="flex justify-center lg:justify-start">
            <Logo className="mb-6" width={180} height={180} priority />
          </div>
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl font-bold font-headline",
              heroContentVisible
                ? "animate-emerge-up animation-delay-200"
                : "opacity-0",
            )}
          >
            <span className="text-primary">Securibot:</span> Votre Allié
            <br className="hidden md:block" /> en Cybersécurité.
          </h1>
          <p
            className={cn(
              "text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0",
              heroContentVisible
                ? "animate-emerge-up animation-delay-400"
                : "opacity-0",
            )}
          >
            Sécurisez votre monde numérique, une conversation à la fois.
          </p>
          <div
            className={cn(
              heroContentVisible
                ? "animate-emerge-up animation-delay-600"
                : "opacity-0",
            )}
          >
            <Link href="/auth" passHref>
              <Button
                size="lg"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 px-10 py-6 text-lg"
              >
                Démarrer
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "lg:w-2/5 xl:w-1/2 relative flex items-center justify-center z-0 mt-16 lg:mt-0",
            heroContentVisible
              ? "animate-emerge-up animation-delay-400"
              : "opacity-0",
          )}
        >
          <div
            className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[600px] animate-float-subtle"
            style={{ animationDuration: "8s" }}
          >
            <Image
              src="https://placehold.co/800x1000.png"
              alt="Abstract cybersecurity visual"
              layout="fill"
              objectFit="contain"
              className="opacity-80"
              data-ai-hint="abstract purple glow"
            />
            <DecorativeHoop
              size={150}
              position="top-[5%] left-[0%]"
              animationDuration="20s"
            />
            <DecorativeHoop
              size={200}
              position="bottom-[10%] right-[10%]"
              animationDuration="25s"
              animationName="animate-spin-slow"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresSectionRef}
        className="py-16 lg:py-24 bg-muted/60 z-10 relative border-t border-border/30"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold font-headline text-primary mb-4",
                featuresVisible ? "animate-emerge-up" : "opacity-0",
              )}
            >
              Découvrez Securibot
            </h2>
            <p
              className={cn(
                "text-lg text-muted-foreground max-w-2xl mx-auto",
                featuresVisible
                  ? "animate-emerge-up animation-delay-200"
                  : "opacity-0",
              )}
            >
              Explorez les fonctionnalités clés conçues pour vous offrir une
              assistance experte en cybersécurité.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuresData.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                shouldAnimate={featuresVisible}
                animationDelay={`${0.2 + index * 0.2}s`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        ref={teamSectionRef}
        className="py-16 lg:py-24 bg-background z-10 relative border-t border-border/30"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold font-headline text-primary mb-4",
                teamVisible ? "animate-emerge-up" : "opacity-0",
              )}
            >
              Notre Équipe d'Experts
            </h2>
            <p
              className={cn(
                "text-lg text-muted-foreground max-w-2xl mx-auto",
                teamVisible
                  ? "animate-emerge-up animation-delay-200"
                  : "opacity-0",
              )}
            >
              Rencontrez les professionnels passionnés derrière Securibot.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={member.name}
                member={member}
                shouldAnimate={teamVisible}
                animationDelay={`${0.2 + index * 0.2}s`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={footerRef}
        className={cn(
          "w-full text-center text-sm text-muted-foreground py-8 mt-auto z-10 bg-muted/60 border-t border-border/30",
          footerVisible ? "animate-emerge-up" : "opacity-0",
        )}
        style={{ animationDelay: footerVisible ? "0s" : undefined }} // Footer animates immediately when visible
      >
        © {new Date().getFullYear()} Securibot. Tous droits réservés.
      </footer>
    </div>
  );
}
