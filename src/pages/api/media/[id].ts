import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Lấy thông tin media từ database
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return res.status(404).json({ error: 'Media not found' });
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
