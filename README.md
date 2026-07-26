# Portfolio Site — Adrian Voss (Template)

A single-page, vanilla HTML/CSS/JS portfolio. No build step, no dependencies.

## Files
- `index.html` — structure & content
- `styles.css` — design tokens, layout, dark/light theme, animations
- `script.js` — theme toggle, mobile menu, scroll reveal, typewriter, form validation

## Customize
1. **Content** — edit the text directly in `index.html` (name, intro, About copy,
   skills, project cards, timeline, contact details).
2. **Colors/fonts** — all design tokens live at the top of `styles.css` under
   `:root` (dark theme) and `[data-theme="light"]` (light theme).
3. **Role rotation** — edit the `roles` array in `script.js` (`typewriter`
   function) to change the words that cycle in the hero.
4. **Photo** — swap the `.portrait-placeholder` block in `index.html` for a real
   `<img>` tag if you'd rather use a photo than the initials placeholder.
5. **Contact form** — the form currently simulates a submission client-side.
   To make it functional, either:
   - Use **Netlify Forms**: add `data-netlify="true"` and a hidden `form-name`
     input to the `<form>` tag (if deploying on Netlify), or
   - Point it at a service like **Formspree** (`action="https://formspree.io/f/yourID"`),
     or wire up your own backend endpoint and replace the `setTimeout` in
     `contactForm()` inside `script.js` with a real `fetch()` call.

## Deploy
This is a fully static site — drag-and-drop the folder onto any static host:

- **Netlify**: drag the folder into the Netlify dashboard, or `netlify deploy`
- **Vercel**: `vercel` from inside this folder
- **GitHub Pages**: push to a repo, enable Pages on the `main` branch
- **Firebase Hosting**: `firebase init hosting` → `firebase deploy`

No environment variables or build commands are required.
