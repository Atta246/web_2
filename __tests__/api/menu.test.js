import { GET, POST } from '../../src/app/api/menu/route';
import * as apiUtils from '../../src/app/lib/api-utils';

// Mock the NextRequest and NextResponse
class MockRequest {
  constructor(body = null) {
    this.body = body;
  }
  
  json() {
    return Promise.resolve(this.body);
  }
}

// Mock the middleware authentication
jest.mock('../../src/app/lib/api-utils', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn(),
  verifyJWTToken: jest.fn().mockReturnValue({ id: 'admin-id', role: 'admin' }),
  validateMenuItemData: jest.fn().mockReturnValue({ isValid: true })
}));

// Mock the database models
jest.mock('../../src/app/models/menuItem', () => ({
  find: jest.fn().mockResolvedValue([
    { _id: '1', name: 'Burger', price: 9.99, category: 'Main', description: 'Tasty burger' }
  ]),
  create: jest.fn().mockResolvedValue({
    _id: '2',
    name: 'Pizza',
    price: 12.99,
    category: 'Main',
    description: 'Delicious pizza'
  })
}));

describe('Menu API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('returns all menu items', async () => {
      const req = new MockRequest();
      
      apiUtils.successResponse.mockReturnValue({
        success: true,
        data: [
          { _id: '1', name: 'Burger', price: 9.99, category: 'Main', description: 'Tasty burger' }
        ],
        message: 'Menu items retrieved successfully'
      });
      
      const response = await GET(req);
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe('Burger');
    });

    it('handles errors properly', async () => {
      const req = new MockRequest();
      
      const mockError = new Error('Database connection failed');
      require('../../src/app/models/menuItem').find.mockRejectedValueOnce(mockError);
      
      apiUtils.errorResponse.mockReturnValue({
        success: false,
        error: 'Failed to retrieve menu items'
      });
      
      const response = await GET(req);
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(apiUtils.errorResponse).toHaveBeenCalled();
    });
  });
});
