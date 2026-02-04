export default function Footnote() {
  return (
    <footer className="border-t px-4 md:px-6 flex justify-center items-center sticky bg-background z-10">
      <p className="text-muted-foreground text-sm leading-normal font-normal mt-2 mb-6">
        Having issues? Contact us at{" "}
        <span className="font-bold">
          <a href="mailto:support@example.com">support@example.com</a>
        </span>
      </p>
    </footer>
  );
}
