import { 
  errorResponse, 
  successResponse 
} from '../../src/app/lib/api-utils';

describe('API Utilities', () => {
  describe('successResponse', () => {
    it('returns a properly formatted success response', () => {
      const data = { name: 'Test Item' };
      const message = 'Item retrieved successfully';
      const response = successResponse(data, message);
      
      expect(response).toEqual({
        success: true,
        data,
        message
      });
    });
    
    it('returns a default message if none provided', () => {
      const data = { name: 'Test Item' };
      const response = successResponse(data);
      
      expect(response).toEqual({
        success: true,
        data,
        message: 'Operation successful'
      });
    });
  });
  
  describe('errorResponse', () => {
    it('returns a properly formatted error response', () => {
      const message = 'Something went wrong';
      const response = errorResponse(message);
      
      expect(response).toEqual({
        success: false,
        error: message
      });
    });
    
    it('returns a default message if none provided', () => {
      const response = errorResponse();
      
      expect(response).toEqual({
        success: false,
        error: 'An error occurred'
      });
    });
    
    it('includes additional provided data', () => {
      const message = 'Validation failed';
      const data = { field: 'name', reason: 'required' };
      const response = errorResponse(message, data);
      
      expect(response).toEqual({
        success: false,
        error: message,
        data
      });
    });
  });
});
