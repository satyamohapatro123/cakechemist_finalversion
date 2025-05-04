
interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
}

export function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="relative">
        <div className="text-5xl text-bakery-300 absolute -top-6 left-0">"</div>
        <blockquote className="text-lg md:text-xl italic px-4 relative">
          {quote}
        </blockquote>
        <div className="text-5xl text-bakery-300 absolute -bottom-10 right-0">"</div>
      </div>
      <div>
        <p className="font-medium text-lg">{author}</p>
        {role && <p className="text-muted-foreground text-sm">{role}</p>}
      </div>
    </div>
  );
}
