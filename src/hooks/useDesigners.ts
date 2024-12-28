import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Designer } from '../types';

export const useDesigners = () => {
  return useQuery<Designer[], Error>({
    queryKey: ['designers'],
    queryFn: async () => {
      // First get designer profiles with their basic info
      const { data: designerProfiles, error: profilesError } = await supabase
        .from('designer_profiles')
        .select(`
          id,
          bio,
          services,
          pricing,
          styles,
          room_types,
          price_per_unit,
          price_unit,
          experience_level,
          rating,
          portfolio_types,
          completed_projects,
          is_approved,
          profiles (
            name
          )
        `)
        .eq('is_approved', true);

      if (profilesError) throw profilesError;

      // Get portfolio images for all designers
      const { data: portfolioImages, error: imagesError } = await supabase
        .from('portfolio_images')
        .select('*')
        .in('designer_id', designerProfiles.map(d => d.id));

      if (imagesError) throw imagesError;

      // Transform the data into the Designer type
      return designerProfiles.map(profile => ({
        id: profile.id,
        name: profile.profiles?.name || 'Designer',
        bio: profile.bio || '',
        services: profile.services,
        pricing: {
          type: profile.pricing?.type || 'hourly',
          rate: profile.pricing?.rate || 0,
          price_per_unit: profile.price_per_unit || 0,
          price_unit: profile.price_unit || 'hour'
        },
        images: portfolioImages
          ?.filter(img => img.designer_id === profile.id)
          .map(img => img.image_url) || [],
        is_approved: profile.is_approved,
        styles: profile.styles || [],
        room_types: profile.room_types || [],
        experience_level: profile.experience_level || 0,
        rating: profile.rating || 0,
        portfolio_types: profile.portfolio_types || [],
        completed_projects: profile.completed_projects || 0
      }));
    }
  });
};