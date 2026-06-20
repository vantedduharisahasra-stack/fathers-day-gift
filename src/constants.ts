/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PuzzlePhoto, GreetingCardData } from './types';

export const DEFAULT_PHOTOS: PuzzlePhoto[] = [
  {
    id: 'photo-1',
    name: 'Memory 1',
    url: '/photos/20240827_000510.jpg',
    credit: 'Family'
  },
  {
    id: 'photo-2',
    name: 'Memory 2',
    url: '/photos/IMG-20200612-WA0020.jpg',
    credit: 'Family'
  },
  {
    id: 'photo-3',
    name: 'Memory 3',
    url: '/photos/IMG-20240602-WA0017.jpg',
    credit: 'Family'
  },
  {
    id: 'photo-4',
    name: 'Memory 4',
    url: '/photos/IMG-20240607-WA0012.jpg',
    credit: 'Family'
  },
  {
    id: 'photo-5',
    name: 'Memory 5',
    url: '/photos/image1.jpeg',
    credit: 'Family'
  }
];

export const TEMPLATE_CARDS: Record<string, GreetingCardData> = {
  sincere: {
    title: "Sincere Gratitude",
    recipient: "Dad",
    sender: "With love",
    themeColor: "gold",
    slides: [
      {
        date: "JUNE 21, 2026",
        heading: "Happy Father's Day, Dad!",
        subheading: "A celebration of the man who taught us everything.",
        body: "From teaching me how to ride a bicycle to offering quiet guidance whenever life felt cluttered, you have always been my anchor."
      },
      {
        date: "NURTURED AND GUIDED",
        heading: "The Steady Compass",
        subheading: "Never shouting, always showing.",
        body: "You taught me that strength isn't about being loud; it is about keeping a cool head, offering a hand to those in need, and working honestly."
      },
      {
        date: "TREASURED MOMENTS",
        heading: "Our Cozy Memories",
        subheading: "The quiet fireplace conversations.",
        body: "The small things remain the biggest: sharing stories by the fireside, driving down empty roads talk-free, and knowing you always have my back."
      }
    ],
    letterContent: `Dear Dad,\n\nI wanted to take a moment today to put into words what I don't say nearly enough: thank you.\n\nThank you for the quiet sacrifices you've made, the steady advice you've given, and the unwavering belief you've always placed in me. Everything good in me is a direct reflection of your mentorship and love.\n\nYou are my teacher, my teammate, and above all, the best father anyone could ever ask for.\n\nHappy Father's Day!\n\nAll my love,\nYour Kid`
  },
  hero: {
    title: "My Everyday Hero",
    recipient: "Dad",
    sender: "With admiration",
    themeColor: "emerald",
    slides: [
      {
        date: "JUNE 21, 2026",
        heading: "To My Everyday Superhero",
        subheading: "No cape required, just endless support.",
        body: "You might not wear a uniform, but in my eyes, there's nobody stronger, wiser, or more reliable than you."
      },
      {
        date: "WISDOM & TOUGH LOVE",
        heading: "The Ultimate Guide",
        subheading: "Finding solutions where others see problems.",
        body: "Whether repairing something in the house or giving life counsel, you've shown me that obstacles are just problems waiting to be solved."
      },
      {
        date: "FOREVER GRATEFUL",
        heading: "The Safest Harbor",
        subheading: "Your hugs could cure any bad day.",
        body: "Thank you for creating a home filled with joy, confidence, and constant safety. You taught me to reach for the stars while keeping my feet on the ground."
      }
    ],
    letterContent: `Dad,\n\nHappy Father's Day! To the world, you might be just one person, but to our family, you are the world.\n\nThank you for working so hard to give us a beautiful life, for guarding us, and for making us laugh until we cried. You show me how to live life with courage, integrity, and humor.\n\nMay today bring you as much joy as you have given us every single day.\n\nYour biggest fan,\nMe`
  },
  playful: {
    title: "Partner-In-Crime & Laughs",
    recipient: "Pop",
    sender: "From your shadow",
    themeColor: "blue",
    slides: [
      {
        date: "JUNE 21, 2026",
        heading: "Happy Father's Day, Pop!",
        subheading: "Champion of dad jokes and backyard games.",
        body: "Life is infinitely brighter and more hilarious with you around. Thank you for never growing up too much!"
      },
      {
        date: "TALES OF ADVENTURE",
        heading: "Partner-In-Adventure",
        subheading: "Camping out under the night sky.",
        body: "From late-night ice cream runs to silly movie marathons, you taught me that playing is just as important as working."
      },
      {
        date: "BEST FRIENDS FOREVER",
        heading: "The Laughs We Shared",
        subheading: "The pun-master's throne holds true.",
        body: "Even when your jokes make us roll our eyes, we wouldn't trade them for anything. You keep our home lighthearted and young."
      }
    ],
    letterContent: `Hey Pop!\n\nHappy Father's Day! Thanks for being the cool dad who let us keep our secrets and always defended us when we wanted to eat dessert before dinner.\n\nyou have a super-talent for turning ordinary, boring days into wacky adventures. Your endless energy and funny bad puns are legendary.\n\nKeep shining, keep smiling, and don't worry—your dad jokes are safe with me (mostly!).\n\nLove you tons,\nYour partner-in-crime`
  }
};
