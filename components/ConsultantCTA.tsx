const LINKEDIN_URL = "https://www.linkedin.com/in/mattboyle3/";

export default function ConsultantCTA() {
  return (
    <div className="bg-ink text-paper rounded-[20px] px-7 md:px-10 py-8 md:py-10 mt-10">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center text-ink text-[14px] font-bold flex-shrink-0">
          M
        </div>
        <div>
          <p className="text-[14px] font-semibold text-paper">Matthew Boyle</p>
          <p className="text-[13px] text-muted-dark">Digital Marketing Consultant &middot; ~20 years experience</p>
        </div>
      </div>
      <p className="text-[14px] md:text-[15px] text-muted-dark leading-[1.6] mb-6 max-w-[520px]">
        Matthew Boyle has over 20 years experience in digital marketing covering a wide range of
        topic areas. He is available for a one-off consultation or ongoing support.
      </p>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-dark inline-block text-[14px] px-5 py-2.5 active:translate-y-px"
      >
        View my LinkedIn profile
      </a>
    </div>
  );
}
