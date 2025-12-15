import { Youtube, Github, Instagram, Linkedin } from "lucide-react";

const socialLinks = [
  {
    title: "Youtube",
    url: "https://www.youtube.com/@vagifrasulzade2002",
    icon: Youtube,
  },
  {
    title: "Instagram",
    url: "https://www.instagram.com/vagif__rasulzade",
    icon: Instagram,
  },
  {
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/vagifrasulzade",
    icon: Linkedin,
  },
  {
    title: "GitHub",
    url: "https://www.github.com/vagifrasulzade",
    icon: Github,
  },
];

export default function SocialMedia() {
  return (
    <div className="flex gap-4">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.title}
            className="p-2 rounded-full bg-secondary  hover:text-accent
                       transition-colors text-black flex items-center justify-center"
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}
