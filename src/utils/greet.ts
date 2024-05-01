import { getPublishDate } from '@finsweet/ts-utils';

/**
 * Greets the user by printing a message in the console.
 * @param name The user's name.
 */
export const greetUser = (name: string) => {
  const publishDate = getPublishDate();

  console.log(`Bonjour ${name}!`);
  console.log(
    `Ce site a été publié pour la dernière fois le ${publishDate?.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    })}.`
  );
};
