import { getProductsByCompanyId } from '@/app/actions/product';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = Number(searchParams.get('companyId'));
  const page = Number(searchParams.get('page')) || 1;
  const limit = 20;

  try {
    const data = await getProductsByCompanyId(companyId, page, limit);
    return Response.json({
      products: data.products,
      hasMore: data.hasMore
    });
  } catch  {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}