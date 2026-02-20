# Design System: Güzel Invest
**Project ID:** 

## 1. Visual Theme & Atmosphere
Clean, minimalist, and highly professional premium real estate aesthetic. The interface should feel spacious and sophisticated, utilizing generous whitespace and crisp lines. It prioritizes clarity and high-end presentation, avoiding heavy shadows or dark themes.

## 2. Color Palette & Roles
* **Primary Brand Orange** (#EC6803): Used for main buttons, highlights, and primary call-to-actions. Represents vibrancy and energy.
* **Clean White** (#FFFFFF): Used for page backgrounds, card backgrounds, and overall spacing.
* **Soft Gray** (#F9FAFB): Used for alternating section backgrounds and subtle contrast blocks.
* **Dark Gray** (#111827): Used for all primary headings and important text.
* **Medium Gray** (#4B5563): Used for body copy, labels, and secondary information.
* **Subtle Border Gray** (#F3F4F6): Used for thin grid dividers and subtle borders.

## 3. Typography Rules
* **Outfit (Modern Geometric Sans-serif)**: Used globally. 
* Headings are bold and clean. 
* Body text is highly readable.
* Avoid default browser serif or generic fonts.

## 4. Component Stylings
* **Buttons:** Subtly rounded (8px/rounded-lg), no heavy drop shadows. Primary buttons are solid Orange (#EC6803) with white text. Secondary buttons have thin borders.
* **Cards/Containers:** Subtly rounded (rounded-lg to rounded-xl). Background is white. Shadows are either absent (relying on very thin gray-100 borders) or whisper-soft (shadow-sm).
* **Badges/Tags:** Small pill-shaped or subtly rounded rectangles. Used for metadata like "1+1", "Hastane Yakını".
* **Icons:** Lucide-style, thin monotone line icons. No emojis (❌ ⚛️ 🌿).

## 5. Layout Principles
* **Whitespace:** Generous padding between sections. Use grid gaps effectively.
* **Dividers:** Instead of hard lines, prefer `gap-px bg-gray-100` patterns where possible.
* **Dark Mode:** Strictly LIGHT THEME ONLY. Do not invert backgrounds for content sections.
