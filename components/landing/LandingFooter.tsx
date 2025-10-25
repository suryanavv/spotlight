export const LandingFooter = () => {
  return (
    <footer className="border-t border-border bg-background py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center text-base font-medium">
            <span className="mr-2 text-primary">✦</span> Spotlight
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Spotlight. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
