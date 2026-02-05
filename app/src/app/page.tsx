import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedDishes } from "@/components/sections/featured-dishes";
import { ChefRecommendations } from "@/components/sections/chef-recommendations";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ExperienceTiles } from "@/components/sections/experience-tiles";
import { PromotionsBanner } from "@/components/sections/promotions-banner";
import { BookingCta } from "@/components/sections/booking-cta";

export default function Home() {
  return (
    <div className="space-y-28 pb-24">
      <HeroSection />
      <PromotionsBanner />
      <FeaturedDishes />
      <ChefRecommendations />
      <ExperienceTiles />
      <TestimonialsSection />
      <BookingCta />
    </div>
  );
}
