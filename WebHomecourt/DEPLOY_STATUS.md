# Sprint 1
## Estado del deploy
Vercel sí está conectado al repo con variables de entorno
Deployment producción main: https://mcgg-lakers-homecourt.vercel.app/
Personal supabase URL: https://esabzagsyxpivebqfbqt.supabase.co

## Bloqueantes actuales
Configuración de autenticación de Google mediante supabase. 

## Próximos pasos
Permitir la autenticación usando Google en supabase Authentication Providers. 

## Último error que encontraste
Ninguno 

# Sprint 2
## Entornos configurados
- Producción:   https://mcgg-lakers-homecourt.vercel.app  (rama: main)
- Desarrollo:   https://dev-mcgg-lakers-homecourt.vercel.app/  (rama: dev)

## Supabase
- Proyecto PROD: https://supabase.com/dashboard/project/esabzagsyxpivebqfbqt 
- Proyecto DEV:  https://supabase.com/dashboard/project/iaotevcghbzuufncnrle 

## Verificación de separación
- [X] Creé un registro en DEV y NO aparece en PROD
- [X] El banner de entorno muestra colores distintos en cada URL
- [X] Las migraciones están aplicadas en ambos proyectos

# Sprint 3
## Responsables de entornos
| Entorno | Rama | Responsable | URL |
|---------|------|-------------|-----|
| Producción | `main` | @mcgg16 | https://mcgg-lakers-homecourt.vercel.app |
| Desarrollo | `develop` | @mcgg16 | https://dev-mcgg-lakers-homecourt.vercel.app/ |

## Branch protection
- [ ] main: requiere PR + 1 aprobación configurado 
- [ ] develop: requiere PR + 1 aprobación configurado
- [X] Verificado: push directo a main falla con error GH006

## Roles del equipo
- Dueño de main:    @mcgg16
- Dueño de develop: @mcgg16

## Evidencia de flujo de PR
- [X] Al menos 1 PR mergeado a develop con review aprobado
      Link: https://github.com/mcgg16/WebHomecourt/pull/10
- [X] Al menos 1 PR de develop → main
      Link: https://github.com/mcgg16/WebHomecourt/pull/13

## Conventional Commits
- [-] Los últimos 5 commits del repo siguen el formato
      (verificar con: git log --oneline -5)

## Para continuar
Actualmente está deshabilitada que se requiera una aprobación adicional configurada porque solo yo estoy trabajando sobre este repositorio, por lo que no hay alguien más que esté revisando mi código. 
Adicionalmente, este trabajo sigue el flujo de feature -> dev -> QA -> staging -> main
También me falta seguir más el formato de keyword: descripción, pero espero mostrar estos en los siguientes sprints. 

# Sprint 4
Me quedé en paso 4 tengo mucho sueño

## Para continuar
Actualmente está deshabilitada que se requiera una aprobación adicional configurada porque solo yo estoy trabajando sobre este repositorio, por lo que no hay alguien más que esté revisando mi código. 
No pude encontrar el require branches to be up to date. 
