/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PuzzlePhoto {
  id: string;
  name: string;
  url: string;
  credit: string;
}

export interface StorySlide {
  heading: string;
  subheading: string;
  date: string;
  body: string;
}

export interface GreetingCardData {
  title: string;
  recipient: string;
  sender: string;
  slides: StorySlide[];
  letterContent: string;
  themeColor: string; // 'gold' | 'rose' | 'emerald' | 'blue' | 'charcoal'
}
