import { DEFAULT_HEADER } from '../../src/constants';
import { IError } from '../../src/features/users/interfaces';
import { setResponseWithErrorMessage } from '../../src/features/users/users.service';

type MockedResponse = {
  writeHead: jest.Mock<any, any[]>;
  end: jest.Mock<any, any[]>;
};
describe('', () => {
  test('response should have correct status code and headers', () => {
    const statusCode = 404;
    const res: MockedResponse = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const obj: IError = {
      message: 'Not found',
      statusCode: 0,
      title: '',
    };

    setResponseWithErrorMessage(statusCode, res, obj);

    expect(res.writeHead).toHaveBeenCalledWith(statusCode, DEFAULT_HEADER);
  });
  test('response should have error message when an error object is provided', () => {
    const statusCode = 404;
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const obj: IError = {
      message: 'Not found',
      statusCode: 0,
      title: '',
    };

    setResponseWithErrorMessage(statusCode, res, obj);

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(obj));
  });
  test('response should not have error message when no error object is provided', () => {
    const statusCode = 404;
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    // @ts-ignore
    setResponseWithErrorMessage(statusCode, res);
    expect(res.end).not.toHaveBeenCalled();
  });
});
