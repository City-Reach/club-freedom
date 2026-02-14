import Footnote from "../footnote";
import Logo from "../logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-muted flex flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Logo />
          {children}
        </div>
      </div>
    </div>
  );
}
