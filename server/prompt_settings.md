# plan for settings
create a schema for settings based on the way we created the target schema. Prisma schema, zod schema, controller, route. 

The following fields should be available:

colTitles json
holidays json
rabates json
voucher json
calendarPast bool
calendarOccurances number
calendarLength number
formFields json
domain text
legalResources string default "https://domain/fileadmin/kunden/mandant/rechtstexte/"
contracts json
regTitleCol1 string
regTitleCol2 string
regTitleDelTime number
regCheckSeats bool
regWaitlist bool
