import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { entity_type, entity_id, relation_type } = req.query;

      let query = supabase
        .from('media')
        .select(`
          *,
          media_relations!inner(
            entity_type,
            entity_id,
            relation_type,
            sort_order,
            is_featured
          )
        `)
        .eq('is_active', true);

      // Filter theo entity nếu có
      if (entity_type && entity_id) {
        query = query.eq('media_relations.entity_type', entity_type)
                    .eq('media_relations.entity_id', entity_id);
      }

      // Filter theo relation_type nếu có
      if (relation_type) {
        query = query.eq('media_relations.relation_type', relation_type);
      }

      const { data, error } = await query.order('media_relations.sort_order');

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
