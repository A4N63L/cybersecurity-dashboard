# Análisis con Nuclei — Frontend Angular

Análisis no intrusivo de vulnerabilidades conocidas y configuraciones expuestas sobre el servicio indicado. Esta entrega solo **enumera** los hallazgos; no aplica correcciones.

- **Fecha (UTC):** 2026-10-21 04:55
- **Servicio:** Frontend Angular
- **Dirección analizada:** `http://172.29.0.6:4200` (resuelta en el contenedor como `http://frontend:4200`)
- **Herramienta:** Nuclei v3.11.1, imagen oficial `projectdiscovery/nuclei` pinneada por digest
- **Plantillas:** snapshot oficial `projectdiscovery/nuclei-templates` en commit `b4826535d814f33522faae784678e62686d33b66`, filtradas a severidades `medium,high,critical`; sin tags `dos`, `fuzz` ni `bruteforce`
- **Finalización verificada:** código de salida `0`, `Scan completed` presente, duración 1008.2 s
- **Resultado:** 0 hallazgo(s) — critical: 0, high: 0, medium: 0

### Comando ejecutado

```
docker exec nuclei-initial-assessment nuclei -u http://frontend:4200 -severity medium,high,critical -t /work/frontend.templates.txt -pt http -duc -dut -ni -nh -no-stdin -dr -nc -or -ot -rl 3 -c 1 -bs 1 -pc 1 -jsc 1 -tlc 1 -timeout 5 -retries 0 -mhe 10 -max-time 30m -stats -si 10 -vv -rsr 1048576 -jle /work/raw/frontend.jsonl -tlog /work/raw/frontend.trace.jsonl -elog /work/raw/frontend.errors.txt
```

### Hallazgos

Sin hallazgos para las plantillas y severidades ejecutadas.

### Errores registrados

```
{"template":"/root/nuclei-templates/http/misconfiguration/microsoft/anonymous-distribution-point-sccm.yaml","type":"http","input":"http://frontend:80/SMS_DP_SMSPKG$/Datalib","address":"frontend:80","error":"port closed or filtered","kind":"network-permanent-error","attrs":{}}
{"template":"/root/nuclei-templates/http/misconfiguration/apachespark-ui-exposed.yaml","type":"http","input":"http://frontend:4040/jobs/","address":"frontend:4040","error":"port closed or filtered","kind":"network-permanent-error","attrs":{}}
```


### Notas de alcance y limitaciones

- Se ejecutaron únicamente plantillas oficiales de Nuclei, con severidades `medium`, `high` y `critical`.
- No se realizaron pruebas autenticadas, fuzzing, fuerza bruta ni pruebas de denegación de servicio.
- Se limitó la tasa a 3 peticiones por segundo y se mantuvieron las protecciones de Fail2Ban activas y sin cambios; no se produjeron bloqueos durante la ejecución.
- No se siguieron redirecciones HTTP ni se enviaron datos de explotación.
- Los resultados reflejan exclusivamente lo observable en la fecha indicada; no sustituyen una revisión manual ni un análisis autenticado.
- Los archivos JSONL contienen la evidencia cruda de Nuclei y no incluyen cuerpos de petición/respuesta ni credenciales.

### Evidencia de ejecución

El proceso terminó con código `0` y el log de la ejecución conserva la línea de finalización de Nuclei. El detalle operativo está en `frontend-nuclei-execution.txt` y los resultados en `frontend-nuclei.jsonl`.

