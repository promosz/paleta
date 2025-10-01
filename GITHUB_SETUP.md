# Instrukcje konfiguracji GitHub

## 🚀 Krok 1: Utworzenie repozytorium na GitHub

1. **Przejdź na GitHub.com** i zaloguj się do swojego konta
2. **Kliknij przycisk "New"** lub "+" w prawym górnym rogu
3. **Wypełnij formularz**:
   - **Repository name**: `paleta`
   - **Description**: `Aplikacja do analizy zestawów produktów z plików XLSX, PDF, CSV`
   - **Visibility**: Public (dla GitHub Pages)
   - **Initialize**: ❌ NIE zaznaczaj "Add a README file" (już mamy)
   - **Initialize**: ❌ NIE zaznaczaj "Add .gitignore" (dodamy później)
   - **Initialize**: ❌ NIE zaznaczaj "Choose a license" (już mamy)

4. **Kliknij "Create repository"**

## 🔗 Krok 2: Konfiguracja remote i push

Po utworzeniu repozytorium, GitHub pokaże instrukcje. Wykonaj następujące komendy:

```bash
# Dodaj remote origin (zastąp [username] swoją nazwą użytkownika)
git remote add origin https://github.com/[username]/paleta.git

# Push do GitHub
git push -u origin main
```

## 📄 Krok 3: Konfiguracja GitHub Pages

1. **Przejdź do Settings** w swoim repozytorium
2. **Przewiń w dół do sekcji "Pages"**
3. **W sekcji "Source"**:
   - Wybierz **"Deploy from a branch"**
   - Branch: **"main"**
   - Folder: **"/ (root)"**
4. **Kliknij "Save"**

## 🌐 Krok 4: Dostęp do strony

Po konfiguracji GitHub Pages, Twoja aplikacja będzie dostępna pod adresem:
```
https://[username].github.io/paleta
```

## 📋 Krok 5: Weryfikacja

Sprawdź czy wszystko działa:
1. **Repozytorium**: https://github.com/[username]/paleta
2. **GitHub Pages**: https://[username].github.io/paleta
3. **Dokumentacja**: Powinna być widoczna na stronie

## 🔧 Dodatkowe ustawienia

### Włączenie Issues i Wiki
1. Przejdź do **Settings** → **Features**
2. Zaznacz **Issues** i **Wiki** (opcjonalnie)

### Konfiguracja branch protection
1. Przejdź do **Settings** → **Branches**
2. Kliknij **"Add rule"**
3. Wpisz **"main"** jako branch name pattern
4. Zaznacz **"Require pull request reviews before merging"**

## 📝 Następne kroki

Po skonfigurowaniu GitHub Pages:

1. **Rozpocznij implementację**:
   ```bash
   npm create vite@latest . --template react-ts
   npm install
   ```

2. **Skonfiguruj Tailwind CSS**:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Dodaj .gitignore**:
   ```bash
   echo "node_modules
   dist
   .DS_Store
   *.log" > .gitignore
   ```

4. **Commit i push**:
   ```bash
   git add .
   git commit -m "feat: Setup React + TypeScript + Vite"
   git push
   ```

---

**Uwaga**: Zastąp `[username]` swoją rzeczywistą nazwą użytkownika GitHub w wszystkich komendach i URL-ach.
