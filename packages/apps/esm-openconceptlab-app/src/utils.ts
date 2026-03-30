const NUMBER_OF_SLASHES_AFTER_BASE_URL = 5;

/*
 * This checks if collection version has been passed to subscription url by checking number of forward slashes after base url
 * If the number is 5, such as with https://api.openconceptlab.org/users/username/collections/collectionname/v1.0
 * that means collection version was passed and isVersionDefinedInUrl() will return true
 * Also returns false if the string is not a valid URL
 */
export const isVersionDefinedInUrl = (subscriptionUrl: string) => {
  if (subscriptionUrl.endsWith('/')) {
    subscriptionUrl = subscriptionUrl.substring(0, subscriptionUrl.lastIndexOf('/'));
  }

  let url;
  try {
    url = new URL(subscriptionUrl);
  } catch (e) {
    return false;
  }

  let count = url.pathname.match(/\//g)?.length ?? 0;
  if (count == NUMBER_OF_SLASHES_AFTER_BASE_URL) {
    return true;
  } else {
    return false;
  }
};
