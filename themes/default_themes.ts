export const organizationThemes: Record<string, Record<string, string>> = {
  default: {
    '--primary': 'oklch(31.96% 0.1 216.6)',
    '--primary-foreground': 'hsl(0 0% 98%)',
    '--background': 'hsl(0 0% 100%)',
    '--foreground': 'hsl(0 0% 3.9%)',
    '--secondary': 'hsl(210 30% 60%)',
    '--secondary-foreground': 'hsl(210 50% 25%)',
    '--card': 'hsl(0 0% 100%)',
    '--card-foreground': 'hsl(0 0% 3.9%)',
    '--muted': 'hsl(210 25% 90%)',
    '--muted-foreground': 'hsl(210 15% 50%)',
    '--accent': 'hsl(200 40% 60%)',
    '--accent-foreground': 'hsl(200 70% 20%)',
    '--destructive': 'hsl(0 84% 60%)',
    '--destructive-foreground': 'hsl(0 0% 98%)',
    '--border': 'hsl(210 10% 80%)',
    '--input': 'hsl(210 20% 93%)',
    '--ring': 'hsl(210 30% 50%)',
    '--popover': 'hsl(0 0% 100%)',
    '--chart-1': 'oklch(0.646 0.222 41.116)',
    '--chart-2': 'oklch(0.6 0.118 184.704)',
    '--chart-3': 'oklch(0.398 0.07 227.392)',
    '--chart-4': 'oklch(0.828 0.189 84.429)',
    '--chart-5': 'oklch(0.769 0.188 70.08)',
    '--sidebar': 'hsl(0 0% 98%)',
    '--sidebar-foreground': 'hsl(0 0% 3.9%)',
    '--sidebar-primary': 'oklch(31.96% 0.1 216.6)',
    '--sidebar-primary-foreground': 'hsl(0 0% 98%)',
    '--sidebar-accent': 'hsl(200 40% 60%)',
    '--sidebar-accent-foreground': 'hsl(200 70% 20%)',
    '--sidebar-border': 'hsl(210 10% 80%)',
    '--sidebar-ring': 'hsl(210 30% 50%)'
  },
  bam: {
    '--primary': 'oklch(31.96% 0.1 216.6)',
    '--primary-foreground': 'hsl(0 0% 98%)',
    '--background': 'hsl(0 0% 100%)',
    '--foreground': 'hsl(200, 96%, 9%)',
    '--secondary': 'hsl(66, 78%, 42%)',
    '--secondary-foreground': 'hsl(210 50% 25%)',
  }
};

export function applyTheme(vars: Record<string, string>) {
  const root = document.documentElement
  Object.entries(vars).forEach(([key, val]) => {
    root.style.setProperty(key, val)
  })
}
