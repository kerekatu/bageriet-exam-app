import * as yup from 'yup'

export const contactSchema = yup.object().shape({
  navn: yup.string(),
  email: yup.string().email().required('Email er påkrævet'),
  emne: yup
    .string()
    .min(3, 'Emne skal være længere end 3 tegn')
    .required('Emne er påkrævet'),
  besked: yup
    .string()
    .min(10, 'Besked skal være længere end 10 tegn')
    .max(2000, 'Besked må ikke være længere end 2000 tegn')
    .required('Besked er påkrævet'),
})

export const loginSchema = yup.object().shape({
  email: yup.string().email().required('Email er påkrævet'),
  password: yup
    .string()
    .min(8, 'Adgangskode skal være længere end 8 tegn')
    .required('Adgangskode er påkrævet'),
})

export const userSchema = yup.object().shape({
  brugernavn: yup
    .string()
    .min(3, 'Brugernavn skal være længere end 3 tegn')
    .required('Brugernavn er påkrævet'),
  fornavn: yup
    .string()
    .min(2, 'Fornavn skal være længere end 2 tegn')
    .required('Fornavn er påkrævet'),
  efternavn: yup
    .string()
    .min(2, 'Efternavn skal være længere end 2 tegn')
    .required('Efternavn er påkrævet'),
  email: yup.string().email().required('Email er påkrævet'),
  password: yup
    .string()
    .min(8, 'Adgangskode skal være længere end 8 tegn')
    .required('Adgangskode er påkrævet'),
})

export const commentSchema = yup.object().shape({
  kommentaren: yup
    .string()
    .min(10, 'Kommentaren skal være længere end 10 tegn')
    .required('Kommantar-feltet er påkrævet'),
})

export const newsletterSchema = yup.object().shape({
  email: yup.string().email().required('Email er påkrævet'),
})

export const newsSchema = yup.object().shape({
  titel: yup
    .string()
    .min(6, 'Titel skal være længere end 6 tegn')
    .required('Titel er påkrævet'),
  teaser: yup
    .string()
    .min(10, 'Teaser skal være længere end 10 tegn')
    .required('Teaser er påkrævet'),
  nyhedstekst: yup
    .string()
    .min(20, 'Nyhedstekst skal være længere end 20 tegn')
    .required('Nyhedstekst er påkrævet'),
  image: yup.mixed().required('Fil er påkrævet'),
})
