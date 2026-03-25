# Team Section Implementation — Setup Guide

## ✅ Completed Steps

1. **Component Created**: `frontend/src/components/Team/TeamSection.tsx`
   - Displays three team members: Matti Gerber, Dean Zhang, Ertugrul Kücükkaya
   - Responsive grid layout (1 mobile, 3 desktop)
   - Image hover scale effect (1.05x)
   - LinkedIn icon with optional links (ready to populate)
   - Fully localized (en, ru, ar, zh)

2. **i18n Translations Added**:
   - `team.sectionLabel` — "Team" (or localized equivalent)
   - `team.sectionTitle` — "Meet our team"
   - `team.openLinkedIn` — LinkedIn accessibility label with member name

3. **Integration Completed**:
   - Imported `TeamSection` in `frontend/src/app/[locale]/(main)/page.tsx`
   - Positioned after Process section, before Projects section
   - Proper spacing/styling (`pb-8 pt-8 sm:pt-10 md:pb-12 md:pt-14`)

4. **Directory Created**:
   - `frontend/public/team/` ready for team member images

## 📁 Next Steps — Add Team Member Images

Place image files in `frontend/public/team/` with exact naming:

- `matti.png` — Matti Gerber (Managing Director)
- `dean.png` — Dean Zhang (Partner)
- `ertugrul.png` — Ertugrul Kücükkaya (IT Intern)

**Recommended image specs**:

- Size: 500×500px minimum (will be 256×256 on display)
- Format: PNG or JPG
- Aspect ratio: Square (1:1)

## 🔗 Optional — Add LinkedIn Profile Links

To enable LinkedIn icons, update team member URLs in `frontend/src/components/Team/TeamSection.tsx`:

```typescript
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "matti",
    name: "Matti Gerber",
    role: "Managing Director",
    imagePath: "/team/matti.png",
    linkedinUrl: "https://linkedin.com/in/matti-gerber", // Add here
  },
  // ... repeat for dean and ertugrul
];
```

When `linkedinUrl` is empty string `""`, the LinkedIn icon still renders as a placeholder. Once populated with a URL, it becomes a clickable link opening the profile in a new tab.

## 🎨 Design Features

- **Styling**: Tailwind CSS (mobile-first responsive)
- **Animations**: Hover scale effect on images
- **Accessibility**: Proper ARIA labels, alt text on images
- **Localization**: Full i18n support with context-based `useI18n()` hook
- **Images**: Next.js `Image` component with optimized rendering

## 📝 Files Modified/Created

Created:

- `frontend/src/components/Team/TeamSection.tsx`
- `frontend/public/team/` (directory)

Modified:

- `frontend/src/app/[locale]/(main)/page.tsx` (added import + component)
- `frontend/src/i18n/locales/en.ts` (team translations)
- `frontend/src/i18n/locales/ru.ts` (team translations)
- `frontend/src/i18n/locales/ar.ts` (team translations)
- `frontend/src/i18n/locales/zh.ts` (team translations)

Updated coordination docs:

- `Scheduled Work On.md` (unlocked team files)
- `Codebase Overview.md` (documented team section)

## ✨ Ready to Use

The component is **production-ready**. Just add the team member images and optionally populate LinkedIn URLs, then deploy!
