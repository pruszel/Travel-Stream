from django.core.management.base import BaseCommand
from django.db import transaction
from app.models import Agency

class Command(BaseCommand):
    help = 'Creates a new agency'

    def add_arguments(self, parser):
        parser.add_argument('--legal-name', type=str, required=True, help='Agency legal name')
        parser.add_argument('--display-name', type=str, required=True, help='Agency display name')
        parser.add_argument('--address', type=str, required=True, help='Agency address')
        parser.add_argument('--address2', type=str, help='Agency address line 2')
        parser.add_argument('--city', type=str, required=True, help='Agency city')
        parser.add_argument('--state', type=str, required=True, help='Agency state')
        parser.add_argument('--zip', type=str, required=True, help='Agency zip code')
        parser.add_argument('--country', type=str, required=True, help='Agency country')
        parser.add_argument('--logo', type=str, help='Path to agency logo')

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                agency = Agency.objects.create(
                    agency_legal_name=options['legal_name'],
                    agency_display_name=options['display_name'],
                    address=options['address'],
                    address2=options.get('address2'),
                    city=options['city'],
                    state=options['state'],
                    zip=options['zip'],
                    country=options['country']
                )
                
                if options.get('logo'):
                    with open(options['logo'], 'rb') as logo_file:
                        agency.logo.save(
                            f"{agency.agency_slug}_logo.png",
                            logo_file
                        )

                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created agency "{agency.agency_display_name}"')
                )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to create agency: {str(e)}')
            )
