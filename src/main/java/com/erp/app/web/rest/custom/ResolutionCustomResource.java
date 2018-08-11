package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.CustomResolution;
import com.erp.app.repository.custom.ResolutionCustomRepository;
import com.erp.app.repository.search.custom.ResolutionCustomSearchRepository;
import com.erp.app.web.rest.errors.BadRequestAlertException;
import com.erp.app.web.rest.util.HeaderUtil;
import com.erp.app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@RestController
@RequestMapping("/api/custom")
public class ResolutionCustomResource {

	private final Logger log = LoggerFactory.getLogger(ResolutionCustomResource.class);

    private static final String ENTITY_NAME = "resolutioncustom";

    private final ResolutionCustomRepository resolutioncustomRepository;

    private final ResolutionCustomSearchRepository resolutioncustomSearchRepository;

    public ResolutionCustomResource(ResolutionCustomRepository resolutioncustomRepository, ResolutionCustomSearchRepository resolutioncustomSearchRepository) {
        this.resolutioncustomRepository = resolutioncustomRepository;
        this.resolutioncustomSearchRepository = resolutioncustomSearchRepository;
    }

    /**
     * POST  /resolutioncustoms : Create a new resolutioncustom.
     *
     * @param resolutioncustom the resolutioncustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new resolutioncustom, or with status 400 (Bad Request) if the resolutioncustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/resolutioncustoms")
    @Timed
    public ResponseEntity<CustomResolution> createResolutionCustom(@Valid @RequestBody CustomResolution resolutioncustom) throws URISyntaxException {
        log.debug("REST request to save CustomResolution : {}", resolutioncustom);
        if (resolutioncustom.getId() != null) {
            throw new BadRequestAlertException("A new resolutioncustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomResolution result = resolutioncustomRepository.save(resolutioncustom);
        resolutioncustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/resolutioncustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /resolutioncustoms : Updates an existing resolutioncustom.
     *
     * @param resolutioncustom the resolutioncustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated resolutioncustom,
     * or with status 400 (Bad Request) if the resolutioncustom is not valid,
     * or with status 500 (Internal Server Error) if the resolutioncustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/resolutioncustoms")
    @Timed
    public ResponseEntity<CustomResolution> updateResolutionCustom(@Valid @RequestBody CustomResolution resolutioncustom) throws URISyntaxException {
        log.debug("REST request to update CustomResolution : {}", resolutioncustom);
        if (resolutioncustom.getId() == null) {
            return createResolutionCustom(resolutioncustom);
        }
        CustomResolution result = resolutioncustomRepository.save(resolutioncustom);
        resolutioncustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, resolutioncustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /resolutioncustoms : get all the resolutioncustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of resolutioncustoms in body
     */
    @GetMapping("/resolutioncustoms")
    @Timed
    public ResponseEntity<List<CustomResolution>> getAllResolutionCustoms(Pageable pageable) {
        log.debug("REST request to get a page of ResolutionCustoms");
        Page<CustomResolution> page = resolutioncustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/resolutioncustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /resolutioncustoms/:id : get the "id" resolutioncustom.
     *
     * @param id the id of the resolutioncustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the resolutioncustom, or with status 404 (Not Found)
     */
    @GetMapping("/resolutioncustoms/{id}")
    @Timed
    public ResponseEntity<CustomResolution> getResolutionCustom(@PathVariable String id) {
        log.debug("REST request to get CustomResolution : {}", id);
        CustomResolution resolutioncustom = resolutioncustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(resolutioncustom));
    }

    /**
     * DELETE  /resolutioncustoms/:id : delete the "id" resolutioncustom.
     *
     * @param id the id of the resolutioncustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/resolutioncustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteResolutionCustom(@PathVariable String id) {
        log.debug("REST request to delete CustomResolution : {}", id);
        resolutioncustomRepository.delete(id);
        resolutioncustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/resolutioncustoms?query=:query : search for the resolutioncustom corresponding
     * to the query.
     *
     * @param query the query of the resolutioncustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/resolutioncustoms")
    @Timed
    public ResponseEntity<List<CustomResolution>> searchResolutionCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ResolutionCustoms for query {}", query);
        Page<CustomResolution> page = resolutioncustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/resolutioncustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
