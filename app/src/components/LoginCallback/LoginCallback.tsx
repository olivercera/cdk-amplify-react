import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { hasErrorInUrl, hasInteractionCode, hasAuthorizationCode } from '@okta/okta-auth-js';

const LoginCallback = () => {
    const history = useHistory();
    const { oktaAuth } = useOktaAuth();

    useEffect(() => {
        const executeAll = async () => {
            const parseFromUrl = async () => {
                try {
                    if (hasInteractionCode(window.location.search)) {
                        await oktaAuth.idx.handleInteractionCodeRedirect(window.location.href);
                    } else if (hasAuthorizationCode(window.location.search)) {
                        await oktaAuth.handleLoginRedirect();
                    } else {
                        throw new Error('Unable to parse url');
                    }
                    history.replace('/');
                } catch (err) {
                    console.log(err);
                }
            };

            if (hasErrorInUrl(window.location.search)) {
                const url = new URL(window.location.href);
                const error = new Error(
                    `${url.searchParams.get('error')}: ${url.searchParams.get('error_description')}`
                );

                return;
            } else if (oktaAuth.isLoginRedirect()) {
                return await parseFromUrl();
            }
        };

        executeAll();
    }, [oktaAuth, history]);

    return null;
};

export default LoginCallback;
