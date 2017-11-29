import { isAuthenticatedResolver, AdminRequiredError } from './auth.resolver';
import Permission from '../../constants/permission';

export const isAdminResolver = isAuthenticatedResolver.createResolver(
    // Extract the user and make sure they are an admin
    (root, args, { permission }) => {
        /*
          If thrown, this error will bubble up to baseResolver's
          error callback (if present).  If unhandled, the error is returned to
          the client within the `errors` array in the response.
        */
        if (permission != Permission.ADMIN) throw new AdminRequiredError();

        /*
          Since we aren't returning anything from the
          request resolver, the request will continue on
          to the next child resolver or the response will
          return undefined if no child exists.
        */
    }
)