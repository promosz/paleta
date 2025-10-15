import React from 'react'
import { Card, CardHeader, CardBody, Input, Button } from '../components/ui'

const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Ustawienia
        </h1>
        <p className="text-neutral-600">
          Konfiguracja aplikacji i preferencje użytkownika
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-800">
              Ustawienia ogólne
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Język"
                value="Polski"
                disabled
                helperText="Język interfejsu użytkownika"
              />
              <Input
                label="Waluta"
                value="PLN"
                disabled
                helperText="Domyślna waluta dla analiz"
              />
              <Input
                label="Format daty"
                value="DD.MM.YYYY"
                disabled
                helperText="Format wyświetlania dat"
              />
            </div>
          </CardBody>
        </Card>

        {/* Analysis Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-800">
              Ustawienia analizy
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Maksymalny rozmiar pliku"
                value="10 MB"
                disabled
                helperText="Limit rozmiaru plików do analizy"
              />
              <Input
                label="Domyślne reguły"
                value="Brak"
                disabled
                helperText="Reguły stosowane automatycznie"
              />
              <Input
                label="Format eksportu"
                value="PDF"
                disabled
                helperText="Domyślny format eksportu wyników"
              />
            </div>
          </CardBody>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-800">
              Zarządzanie danymi
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Button variant="secondary" className="w-full">
                Eksportuj wszystkie dane
              </Button>
              <Button variant="secondary" className="w-full">
                Importuj dane
              </Button>
              <Button variant="danger" className="w-full">
                Usuń wszystkie dane
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-800">
              O aplikacji
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-neutral-700">Wersja:</span>
                <span className="ml-2 text-neutral-600">1.0.0</span>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Licencja:</span>
                <span className="ml-2 text-neutral-600">MIT</span>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Autor:</span>
                <span className="ml-2 text-neutral-600">Paleta Team</span>
              </div>
              <div className="pt-4">
                <Button variant="secondary" className="w-full">
                  Sprawdź aktualizacje
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Settings
