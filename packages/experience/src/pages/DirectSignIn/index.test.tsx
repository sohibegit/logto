import { useParams as useParamsMock } from 'react-router-dom';

import renderWithPageContext from '@/__mocks__/RenderWithPageContext';
import { socialConnectors } from '@/__mocks__/logto';

import DirectSignIn from '.';

jest.mock('@/containers/SocialSignInList/use-social', () =>
  jest.fn().mockReturnValue({
    socialConnectors,
    invokeSocialSignIn: jest.fn(() => {
      window.location.assign('/social-redirect-to');
    }),
  })
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({}),
}));

const useParams = useParamsMock as jest.Mock;

const assign = jest.fn();
const replace = jest.fn();
const search = jest.fn();

// eslint-disable-next-line @silverhand/fp/no-mutating-methods
Object.defineProperty(window, 'location', {
  value: {
    assign,
    replace,
  },
  writable: true,
});

// eslint-disable-next-line @silverhand/fp/no-mutating-methods
Object.defineProperty(window.location, 'search', {
  get: search,
});

describe('DirectSignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fallback to the first screen when `directSignIn` is not provided', () => {
    renderWithPageContext(<DirectSignIn />);
    expect(replace).toBeCalledWith('/sign-in');
  });

  it('should fallback to the first screen when `directSignIn` is invalid', () => {
    useParams.mockReturnValue({ method: 'foo' });
    renderWithPageContext(<DirectSignIn />);
    expect(replace).toBeCalledWith('/sign-in');
  });

  it('should fallback to the first screen provided in the fallback parameter', () => {
    useParams.mockReturnValue({ method: 'method', target: 'target' });
    search.mockReturnValue('?fallback=register');
    renderWithPageContext(<DirectSignIn />);
    expect(replace).toBeCalledWith('/register');
  });

  it('should fallback to the first screen when method is valid but target is invalid', () => {
    useParams.mockReturnValue({ method: 'social', target: 'something' });
    search.mockReturnValue('?fallback=sign-in');
    renderWithPageContext(<DirectSignIn />);
    expect(replace).toBeCalledWith('/sign-in');
  });

  it('should invoke social sign-in when method is social and target is valid', () => {
    useParams.mockReturnValue({ method: 'social', target: socialConnectors[0]!.target });
    search.mockReturnValue(`?fallback=sign-in`);

    renderWithPageContext(<DirectSignIn />);

    expect(replace).not.toBeCalled();
    expect(assign).toBeCalledWith('/social-redirect-to');
  });
});
